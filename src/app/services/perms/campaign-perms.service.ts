/** @format */

import { Injectable } from '@nestjs/common';
import IPermsResponse from '../../interfaces/perms-response.interface';
import IAuthDetail from '../../../app/interfaces/authdetail.interface';
import EUserStatus, { EUserRole } from '../../../app/enum/user.enum';
import UserEntity from '../../../db/entities/user.entity';
import UserCampaignManagerEntity from '../../../db/entities/user-campaign-manager.entity';

@Injectable()
class CampaignPermissionService {
	public async canCreateCampaign(
		authDetail: IAuthDetail,
		managers: string[] = []
	): Promise<IPermsResponse> {
		if (
			authDetail.currentUser.role === EUserRole.USER ||
			authDetail.currentUser.role === EUserRole.USER_VIEW_ALL
		) {
			if (managers.length === 0) {
				return {
					success: false,
					error: `Specify Campaign Managers`,
					httpCode: 400,
				};
			}

			for (const manager of managers) {
				const e = await UserEntity.findOne(manager);
				if (!e || e.status !== EUserStatus.ACTIVE) {
					return {
						success: false,
						error: `Specify Valid Campaign Managers`,
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
	public async canUpdateCampaign(authDetail: IAuthDetail, id: string): Promise<IPermsResponse> {
		if (
			authDetail.currentUser.role === EUserRole.USER ||
			authDetail.currentUser.role === EUserRole.USER_VIEW_ALL
		) {
			const e = await UserCampaignManagerEntity.findOne({
				where: {
					userId: authDetail.currentUser.id,
					campaignId: id,
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

export default CampaignPermissionService;
