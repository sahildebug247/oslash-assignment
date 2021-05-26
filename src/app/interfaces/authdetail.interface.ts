/** @format */

import UserEntity from '../../db/entities/user.entity';

export default interface IAuthDetail {
	currentUser: UserEntity;
	currentIp: string;
	jwtToken: string;
	timezone: string;
}
