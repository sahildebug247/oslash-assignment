/** @format */

import { Module } from '@nestjs/common';
import UserService from '../services/user.service';
import UserController from '../controllers/user.controller';
import UserPermissionService from '../services/perms/user-perms.service';
import LogService from '../services/log.service';
@Module({
	providers: [UserService, UserPermissionService, LogService],
	exports: [],
	controllers: [UserController],
})
export class UserModule {}
