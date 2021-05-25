/** @format */

import CampaignCredentialEntity from '../../db/entities/campaign-credential.entity';
import UserEntity from '../../db/entities/user.entity';

export default interface IAuthDetail {
	currentUser: UserEntity;
	cred?: CampaignCredentialEntity;
	currentIp: string;
	jwtToken: string;
	timezone: string;
}
export interface IThreadTrackingAuthDetail {
	cred: CampaignCredentialEntity;
	currentIp: string;
	jwtToken: string;
}
