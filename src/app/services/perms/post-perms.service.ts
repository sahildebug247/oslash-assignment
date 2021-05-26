/** @format */

import { Injectable } from '@nestjs/common';
import EMessages from '../../constants/messages.constant';
import IAuthDetail from '../../interfaces/authdetail.interface';
import PostEntity from '../../../db/entities/post.entity';
import IPermsResponse from '../../interfaces/perms-response.interface';
import { In } from 'typeorm';
import { EPostStatus } from '../../enum/post.enum';
import { EUserRole } from '../../enum/user.enum';

@Injectable()
class PostPermissionService {
	public async canCreatePosts(title: string): Promise<IPermsResponse> {
		const entity = await PostEntity.findOne({
			where: {
				title,
			},
		});
		if (entity) {
			return {
				success: false,
				error: EMessages.POST_WITH_TITLE_ALREADY_EXISTS,
				httpCode: 400,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}

	public async canDeletePost(id: string, authDetail: IAuthDetail): Promise<IPermsResponse> {
		const entity = await PostEntity.findOne({
			where: {
				id,
				status: In([EPostStatus.UNPUBLISHED, EPostStatus.PUBLISHED, EPostStatus.REJECTED]),
			},
		});
		if (!entity) {
			return {
				success: false,
				error: EMessages.INVALID_ID,
				httpCode: 400,
			};
		}
		const { currentUser } = authDetail;
		if (currentUser.id !== entity.userId && currentUser.role === EUserRole.USER) {
			return {
				success: false,
				error: EMessages.UNAUTHORIZED_REQUEST,
				httpCode: 403,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}

	public async canUpdatePost(id: string, authDetail: IAuthDetail): Promise<IPermsResponse> {
		const entity = await PostEntity.findOne({
			where: {
				id,
				isPendingAdminApproval: false,
				status: In([EPostStatus.UNPUBLISHED, EPostStatus.PUBLISHED]),
			},
		});
		if (!entity) {
			return {
				success: false,
				error: EMessages.INVALID_ID,
				httpCode: 400,
			};
		}
		const { currentUser } = authDetail;
		if (currentUser.id !== entity.userId && currentUser.role === EUserRole.USER) {
			return {
				success: false,
				error: EMessages.UNAUTHORIZED_REQUEST,
				httpCode: 403,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}
}

export default PostPermissionService;
