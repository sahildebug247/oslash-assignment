/** @format */

import { Module } from '@nestjs/common';
import UserService from '../services/user.service';
import UserController from '../controllers/user.controller';
import UserPermissionService from '../services/perms/user-perms.service';
@Module({
	providers: [UserService, UserPermissionService],
	exports: [],
	controllers: [UserController],
})
export class UserModule {}
