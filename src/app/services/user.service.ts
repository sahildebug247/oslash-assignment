/** @format */

import { Injectable } from '@nestjs/common';
import BCrypt from 'bcryptjs';
import UserEntity from '../../db/entities/user.entity';
import Logger from '../../lib/Logger';
import ReturnVal from '../../lib/ReturnVal';
import EMessages from '../constants/messages.constant';
import EUserStatus from '../enum/user.enum';
import IAuthDetail from '../interfaces/authdetail.interface';
import IPermsResponse from '../interfaces/perms-response.interface';
import IUserLoginResponse from '../interfaces/user-login.interface';
import AuthService from './auth.service';
import UserPermissionService from './perms/user-perms.service';

const logger = new Logger('UserService');

@Injectable()
export default class UserService {
	constructor(
		private readonly authService: AuthService,
		private readonly permissionService: UserPermissionService
	) {}

	public async register(userRegisterSchema: any): Promise<ReturnVal> {
		const { name, password, username, timezone } = userRegisterSchema;

		const permsRes: IPermsResponse = await this.permissionService.canRegisterUser(username);
		if (!permsRes.success) {
			return ReturnVal.error(permsRes.error, permsRes.httpCode);
		}
		const userEntity: UserEntity = UserEntity.create({
			name,
			password,
			username,
			timezone,
			status: EUserStatus.ACTIVE,
		});

		try {
			await userEntity.save();
			return ReturnVal.success(EMessages.USER_REGISTERED, '', 201);
		} catch (e) {
			logger.error(`${EMessages.USER_REGISTRATION_FAILED}, e: ${e.message}`);
			return ReturnVal.error(EMessages.USER_REGISTRATION_FAILED, 400);
		}
	}

	public async login({ username, password }): Promise<ReturnVal<IUserLoginResponse>> {
		const userEntity: UserEntity = await UserEntity.findOne({
			where: { username },
		});
		const permsRes: IPermsResponse = await this.permissionService.canUserLogin(userEntity);
		if (!permsRes.success) {
			return ReturnVal.error(permsRes.error, permsRes.httpCode);
		}

		try {
			const isMatching = await BCrypt.compare(password, userEntity.password);
			if (isMatching) {
				const token = await this.authService.generateJWTToken(userEntity);
				await userEntity.save();
				return ReturnVal.success(
					{
						token,
						user: {
							id: userEntity.id,
							name: userEntity.name,
							username: userEntity.username,
							timezone: userEntity.timezone,
						},
					},
					EMessages.LOGIN_SUCCESSFUL,
					201
				);
			}

			return ReturnVal.error(EMessages.INVALID_CREDENTIALS, 401);
		} catch (e) {
			logger.error(`Error occurred while logging user in, e: ${e.message}`);
		}
	}

	public async getMe(authDetail: IAuthDetail): Promise<ReturnVal<Partial<UserEntity>>> {
		return ReturnVal.success(authDetail.currentUser.toJSON(), EMessages.RESOURCE_FOUND, 200);
	}

	public async updateSelf(body: any, authDetail: IAuthDetail): Promise<ReturnVal<Partial<UserEntity>>> {
		const userToUpdate = authDetail.currentUser;
		Object.assign(userToUpdate, body);
		try {
			if (Object.keys(body).indexOf('username') !== -1) {
				const userEntity = await UserEntity.findOne({
					where: {
						username: body.username,
					},
				});

				if (userEntity) {
					return ReturnVal.error(EMessages.USERNAME_NOT_AVAILABLE, 400);
				}
			}
			await userToUpdate.save();
		} catch (e) {
			return ReturnVal.error(EMessages.USER_COULD_NOT_BE_UPDATED, 500);
		}
		return ReturnVal.success(userToUpdate.toJSON(), EMessages.PROFILE_UPDATED_SUCCESSFULLY);
	}

	public async updatePassword(body, authDetail: IAuthDetail): Promise<ReturnVal<string>> {
		const { currentUser } = authDetail;
		const { currentPassword, newPassword } = body;
		const permsResponse = await this.permissionService.canUpdatePassword(currentUser);
		if (!permsResponse.success) {
			return ReturnVal.error(permsResponse.error, permsResponse.httpCode);
		}

		try {
			if (BCrypt.compareSync(currentPassword, currentUser.password)) {
				currentUser.password = BCrypt.hashSync(newPassword, 10);
				await currentUser.save();
				return ReturnVal.success('', EMessages.PASSWORD_UPDATED_SUCCESSFULLY);
			}
		} catch (e) {
			logger.error(`${EMessages.PASSWORD_COULD_NOT_BE_UPDATED}: ${e.message}`);
			return ReturnVal.error(EMessages.PASSWORD_COULD_NOT_BE_UPDATED);
		}

		return ReturnVal.error(EMessages.PASSWORD_DOES_NOT_MATCH);
	}

	public async deactivateUser(
		id: string,
		authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<UserEntity>>> {
		const userEntity = await UserEntity.findOne(id);
		if (!userEntity) {
			return ReturnVal.error(EMessages.INVALID_ID);
		}
		userEntity.status = EUserStatus.INACTIVE;
		await userEntity.save();
		return ReturnVal.success(
			userEntity.toJSON(authDetail.currentUser.timezone),
			EMessages.RESOURCE_UPDATED_SUCCESSFULLY
		);
	}
}
