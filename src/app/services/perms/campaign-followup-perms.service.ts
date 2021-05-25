/** @format */

import { Injectable } from '@nestjs/common';
import IPermsResponse from '../../interfaces/perms-response.interface';
import EMessages from '../../constants/messages.constant';
import CampaignEntity from '../../../db/entities/campaign.entity';
import CampaignFollowupEntity from '../../../db/entities/campaign-followup.entity';
import IAuthDetail from '../../../app/interfaces/authdetail.interface';
import { EUserRole } from '../../../app/enum/user.enum';
import UserCampaignManagerEntity from '../../../db/entities/user-campaign-manager.entity';

@Injectable()
class CampaignFollowupPermissionService {
	public async canCreateFollowUps(
		campaignId: string,
		priority: number,
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
		const followupEntity = await CampaignFollowupEntity.findOne({
			where: {
				priority,
				campaignId,
			},
		});
		if (followupEntity) {
			return {
				success: false,
				error: EMessages.FOLLOWUP_WITH_SAME_PRIORITY_ALREADY_EXISTS,
				httpCode: 400,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}

	public async canUpdateFollowUps(id: string, authDetail: IAuthDetail): Promise<IPermsResponse> {
		const campaignFollowupEntity = await CampaignFollowupEntity.findOne(id);
		if (!campaignFollowupEntity) {
			return {
				success: false,
				error: EMessages.INVALID_ID,
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
					campaignId: campaignFollowupEntity.campaignId,
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

		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}
}

export default CampaignFollowupPermissionService;
