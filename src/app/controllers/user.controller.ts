/** @format */

import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
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

	@Post('login')
	@HandleReturnVal
	public async login(
		@Body(new ValidationPipe(UserLoginSchema)) userLoginSchema
	): Promise<ReturnVal<IUserLoginResponse>> {
		return this.userService.login(userLoginSchema);
	}

	@Post('')
	@UseGuards(AuthenticationGuard, new RolesGuard([EUserRole.SUPER_ADMIN]))
	@HandleReturnVal
	public async register(
		@Body(new ValidationPipe(UserRegisterSchema)) userRegisterSchema,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal> {
		return this.userService.register(userRegisterSchema, authDetail);
	}

	@Put('password')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async updatePassword(
		@Body(new ValidationPipe(UpdatePasswordSchema)) body,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<string>> {
		return this.userService.updatePassword(body, authDetail);
	}

	@Put('deactivate')
	@UseGuards(AuthenticationGuard, new RolesGuard([EUserRole.SUPER_ADMIN]))
	@HandleReturnVal
	public async deactivateUser(
		@Query('id', new StringValidationPipe(EntityIdSchema)) id: string,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<UserEntity>>> {
		return this.userService.deactivateUser(id, authDetail);
	}

	@Put('')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async updateSelf(
		@Body(new ValidationPipe(SelfUpdateSchema)) body,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<UserEntity>>> {
		return this.userService.updateSelf(body, authDetail);
	}
}
