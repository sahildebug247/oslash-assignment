/** @format */

import { Injectable } from '@nestjs/common';
import UserEntity from '../../db/entities/user.entity';
import ConfigService from './config.service';
import JWT from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid';
import ReturnVal from '../../lib/ReturnVal';
import EMessages from '../constants/messages.constant';
import EUserStatus from '../enum/user.enum';

@Injectable()
export default class AuthService {
	constructor(private readonly configService: ConfigService) {}

	public async generateJWTToken(user: UserEntity) {
		const payload = {
			user_id: user.id,
			random: uuidV4,
		};
		return JWT.sign(payload, this.configService.getJWTSecret(), {
			expiresIn: this.configService.getJwtExpiresIn(),
		});
	}

	public async validateJWTToken(jwtToken: string): Promise<ReturnVal> {
		try {
			const decoded: any = JWT.verify(jwtToken, this.configService.getJWTSecret());
			const { user_id } = decoded;
			const user = await UserEntity.findOne({ where: { id: user_id } });
			if (!user) return ReturnVal.error(EMessages.INVALID_AUTHENTICATION_TOKEN, 401);
			if (user.status !== EUserStatus.ACTIVE)
				return ReturnVal.error(EMessages.INACTIVE_USER_ACCOUNT, 403);
			if (!user) return ReturnVal.error(EMessages.INVALID_AUTHENTICATION_TOKEN, 403);
			return ReturnVal.success(user);
		} catch (e) {
			return ReturnVal.error(EMessages.INVALID_AUTHENTICATION_TOKEN, 401);
		}
	}
}
