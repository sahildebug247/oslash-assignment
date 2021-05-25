/** @format */

import { Injectable } from '@nestjs/common';
import UserEntity from '../../../db/entities/user.entity';
import EMessages from '../../constants/messages.constant';
import EUserStatus from '../../enum/user.enum';
import IPermsResponse from '../../interfaces/perms-response.interface';

@Injectable()
class UserPermissionService {
	public async canRegisterUser(username: string): Promise<IPermsResponse> {
		const userEntity = await UserEntity.findOne({
			where: {
				username,
			},
		});
		if (userEntity) {
			return {
				success: false,
				error: EMessages.EMAIL_OR_USERNAME_ALREADY_EXISTS,
				httpCode: 400,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}

	public async canUserLogin(user: UserEntity): Promise<IPermsResponse> {
		if (!user) {
			return {
				success: false,
				error: EMessages.INVALID_CREDENTIALS,
				httpCode: 401,
			};
		}

		if (user.status !== EUserStatus.ACTIVE) {
			return {
				success: false,
				error: EMessages.INACTIVE_USER_ACCOUNT,
				httpCode: 401,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}

	public async canUpdatePassword(user: UserEntity): Promise<IPermsResponse> {
		if (user.status !== EUserStatus.ACTIVE) {
			return {
				success: false,
				error: EMessages.INACTIVE_USER_ACCOUNT,
				httpCode: 403,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}
}

export default UserPermissionService;
