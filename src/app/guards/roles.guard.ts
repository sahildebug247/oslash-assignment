/** @format */

import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import EMessages from '../constants/messages.constant';
import { EUserRole } from '../enum/user.enum';

@Injectable()
class RolesGuard implements CanActivate {
	constructor(private readonly roles: EUserRole[]) {}

	public canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const index = this.roles.indexOf(user.role);
		if (index !== -1) {
			return true;
		} else {
			throw new HttpException(EMessages.PERMISSION_DENIED, 403);
		}
	}
}

export default RolesGuard;
