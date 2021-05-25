/** @format */

import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import UserEntity from '../../db/entities/user.entity';
import ReturnVal from '../../lib/ReturnVal';
import AuthDetail from '../../util/decorator/controller-Authdetail.decorator';
import HandleReturnVal from '../../util/decorator/handle-returnval.decorator';
import { EUserRole } from '../enum/user.enum';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';
import IAuthDetail from '../interfaces/authdetail.interface';
import IUserLoginResponse from '../interfaces/user-login.interface';
import StringValidationPipe from '../pipes/string-validation.pipe';
import ValidationPipe from '../pipes/validation.pipe';
import { EntityIdSchema } from '../schemas/global.schema';
import {
	SelfUpdateSchema,
	UpdatePasswordSchema,
	UserLoginSchema,
	UserRegisterSchema,
} from '../schemas/user.schema';
import UserService from '../services/user.service';
@Controller('user')
export default class UserController {
	constructor(private readonly userService: UserService) {}
	/*
  Get Routes

  */

	@Get('me')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async getMe(@AuthDetail() authDetail: IAuthDetail): Promise<ReturnVal<Partial<UserEntity>>> {
		return this.userService.getMe(authDetail);
	}

	@Post('')
	@UseGuards(AuthenticationGuard)
	@UseGuards(new RolesGuard([EUserRole.SUPER_ADMIN]))
	@HandleReturnVal
	public async register(
		@Body(new ValidationPipe(UserRegisterSchema)) userRegisterSchema
	): Promise<ReturnVal> {
		return this.userService.register(userRegisterSchema);
	}

	@Post('login')
	@HandleReturnVal
	public async login(
		@Body(new ValidationPipe(UserLoginSchema)) userLoginSchema
	): Promise<ReturnVal<IUserLoginResponse>> {
		return this.userService.login(userLoginSchema);
	}

	@Put('updateSelf')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async updateSelf(
		@Body(new ValidationPipe(SelfUpdateSchema)) body,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<UserEntity>>> {
		return this.userService.updateSelf(body, authDetail);
	}

	@Put('update-password')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async updatePassword(
		@Body(new ValidationPipe(UpdatePasswordSchema)) body,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<string>> {
		return this.userService.updatePassword(body, authDetail);
	}

	@Put('deactivate')
	@UseGuards(AuthenticationGuard)
	@UseGuards(new RolesGuard([EUserRole.SUPER_ADMIN]))
	@HandleReturnVal
	public async deactivateUser(
		@Body(new StringValidationPipe(EntityIdSchema)) id: string,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<UserEntity>>> {
		return this.userService.deactivateUser(id, authDetail);
	}
}
