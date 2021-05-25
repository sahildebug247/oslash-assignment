/** @format */

import { Injectable } from '@nestjs/common';
import IPermsResponse from '../../interfaces/perms-response.interface';
import EMessages from '../../constants/messages.constant';
import CampaignEntity from '../../../db/entities/campaign.entity';
import CampaignDeploymentEntity from '../../../db/entities/campaign-deployments.entity';
import CampaignCredentialEntity from '../../../db/entities/campaign-credential.entity';
import ECampaignDeploymentStatus from '../../../app/enum/campaign-deployment-status.enum';
import { ECampaignStatus } from '../../../app/enum/campaign.enum';
import ECampaignCredentialsStatus from '../../../app/enum/campaign-credentials-status.enum';
import { In } from 'typeorm';
import IAuthDetail from '../../interfaces/authdetail.interface';
import { EUserRole } from '../../enum/user.enum';

@Injectable()
class CampaignDeploymentPermissionService {
	public async canCreateDeployments(
		credentialId: string,
		authDetail: IAuthDetail
	): Promise<IPermsResponse> {
		if (authDetail.currentUser.role !== EUserRole.SUPER_ADMIN) {
			return {
				success: false,
				error: EMessages.UNAUTHORIZED_REQUEST,
				httpCode: 401,
			};
		}
		const credEntity = await CampaignCredentialEntity.findOne({
			where: {
				id: credentialId,
			},
			relations: ['campaign'],
		});
		if (!credEntity) {
			return {
				success: false,
				error: EMessages.INVALID_CREDENTIAL_ID,
				httpCode: 400,
			};
		}
		if (credEntity.creatingDeployment) {
			return {
				success: false,
				error: EMessages.CAMPAIGN_DEPLOYMENT_ALREADY_IN_PROGRESS,
				httpCode: 400,
			};
		}
		const campaignEntity = await credEntity.campaign;

		if (campaignEntity.status === ECampaignStatus.TERMINATED) {
			credEntity.status = ECampaignCredentialsStatus.TERMINATED;
			await credEntity.save();
			return {
				success: false,
				error: EMessages.DEPLOYMENT_COULD_NOT_BE_CREATED_CAMPAIGN_TERMINATED,
				httpCode: 400,
			};
		}
		const deployment = await CampaignDeploymentEntity.findOne({
			where: {
				status: In([
					ECampaignDeploymentStatus.ACTIVE,
					ECampaignDeploymentStatus.UNAVAILABLE,
					ECampaignDeploymentStatus.INACTIVE,
				]),
				credentialId,
			},
		});
		if (deployment) {
			return {
				success: false,
				error: EMessages.ACTIVE_DEPLOYMENT_ALREADY_EXISTS,
				httpCode: 400,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}

	public async canUpdateDeployments(
		id: string,
		campaignId: string,
		credentialId: string,
		authDetail: IAuthDetail
	): Promise<IPermsResponse> {
		if (authDetail.currentUser.role !== EUserRole.SUPER_ADMIN) {
			return {
				success: false,
				error: EMessages.UNAUTHORIZED_REQUEST,
				httpCode: 401,
			};
		}
		const campaignDeploymentEntity = await CampaignDeploymentEntity.findOne(id);
		if (!campaignDeploymentEntity) {
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

		if (credentialId) {
			const credEntity = await CampaignCredentialEntity.findOne({
				where: {
					id: credentialId,
				},
			});
			if (!credEntity) {
				return {
					success: false,
					error: EMessages.INVALID_CREDENTIAL_ID,
					httpCode: 400,
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

export default CampaignDeploymentPermissionService;
