/** @format */

import { Injectable } from '@nestjs/common';
import IPermsResponse from '../../interfaces/perms-response.interface';
import EMessages from '../../constants/messages.constant';
import CampaignEntity from '../../../db/entities/campaign.entity';
import CampaignCredentialEntity from '../../../db/entities/campaign-credential.entity';
import IAuthDetail from '../../../app/interfaces/authdetail.interface';
import { EUserRole } from '../../../app/enum/user.enum';
import UserCampaignManagerEntity from '../../../db/entities/user-campaign-manager.entity';

@Injectable()
class CampaignCredentialPermissionService {
	public async canCreateCredentials(
		campaignId: string,
		email: string,
		authDetail: IAuthDetail
	): Promise<IPermsResponse> {
		const campaignEntity = await CampaignEntity.findOne({
			where: {
				id: campaignId,
			},
		});
		if (!campaignEntity) {
			return {
				success: false,
				error: EMessages.INVALID_CAMPAIGN_ID,
				httpCode: 400,
			};
		}
		if (
			authDetail.currentUser.role === EUserRole.USER ||
			authDetail.currentUser.role === EUserRole.USER_VIEW_ALL
		) {
			const e = await UserCampaignManagerEntity.findOne({
				where: {
					userId: authDetail.currentUser.id,
					campaignId,
				},
			});
			if (!e) {
				return {
					success: false,
					error: `Unauthorized Access`,
					httpCode: 401,
				};
			}
		}
		const credentialEntity = await CampaignCredentialEntity.findOne({
			where: {
				campaignId,
				email: email.toLowerCase(),
			},
			relations: ['campaign'],
		});
		if (credentialEntity) {
			return {
				success: false,
				error: EMessages.EMAIL_ALREADY_IN_USE_FOR_THIS_CAMPAIGN,
				httpCode: 400,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}

	public async canUpdateCredentials(
		id: string,
		campaignId: string,
		email: string
	): Promise<IPermsResponse> {
		const campaignCredentialEntity = await CampaignCredentialEntity.findOne(id);
		if (!campaignCredentialEntity) {
			return {
				success: false,
				error: EMessages.INVALID_ID,
				httpCode: 400,
			};
		}
		if (campaignId) {
			const campaignEntity = await CampaignEntity.findOne({
				where: {
					id: campaignId,
				},
			});
			if (!campaignEntity) {
				return {
					success: false,
					error: EMessages.INVALID_CAMPAIGN_ID,
					httpCode: 400,
				};
			}
		}
		if (email) {
			email = email.toLowerCase();
			if (campaignId) {
				const credentialEntity = await CampaignCredentialEntity.findOne({
					where: {
						campaignId,
						id,
						email,
					},
				});
				if (credentialEntity) {
					return {
						success: false,
						error: EMessages.EMAIL_ALREADY_IN_USE_FOR_THIS_CAMPAIGN,
						httpCode: 400,
					};
				}
			} else {
				const credentialEntity = await CampaignCredentialEntity.findOne({
					where: {
						id,
						email,
					},
				});
				if (credentialEntity) {
					return {
						success: false,
						error: EMessages.EMAIL_ALREADY_IN_USE_FOR_THIS_CAMPAIGN,
						httpCode: 400,
					};
				}
			}
		}

		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}
}

export default CampaignCredentialPermissionService;
