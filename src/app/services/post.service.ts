/** @format */

import { Injectable } from '@nestjs/common';
import { ILike, In } from 'typeorm';
import PostEntity from '../../db/entities/post.entity';
import UserEntity from '../../db/entities/user.entity';
import ReturnVal from '../../lib/ReturnVal';
import EMessages from '../constants/messages.constant';
import { ELogAction, ELogType } from '../enum/log.enum';
import { EPostPendingAction, EPostStatus } from '../enum/post.enum';
import ETable from '../enum/table.enum';
import { EUserRole } from '../enum/user.enum';
import IAuthDetail from '../interfaces/authdetail.interface';
import IPermsResponse from '../interfaces/perms-response.interface';
import ConfigService from './config.service';
import LogService from './log.service';
import PostPermissionService from './perms/post-perms.service';

@Injectable()
export default class PostService {
	constructor(
		private readonly configService: ConfigService,
		private readonly logService: LogService,
		private readonly permissionService: PostPermissionService
	) {}

	public async getPosts(
		page: number,
		titleFilter: string,
		userIdFilter: string,
		authDetail: IAuthDetail
	): Promise<ReturnVal> {
		const { currentUser } = authDetail;
		const filters = this.getFilters(currentUser, titleFilter, userIdFilter);
		const offset: number = --page * +this.configService.getEntityFetchLimit();

		const posts = await PostEntity.findAndCount({
			skip: offset,
			take: Number(this.configService.getEntityFetchLimit()),
			where: filters,
			order: {
				updatedAt: 'DESC',
			},
		});
		const postsEntities: PostEntity[] = posts[0];
		const postCount: number = posts[1];
		const postsMap = [];
		for (const post of postsEntities) {
			postsMap.push({ ...post.toJSON(currentUser.timezone) });
		}
		return ReturnVal.success({
			posts: postsMap,
			count: postCount,
		});
	}

	public async getPendingAdminApprovals(
		page: number,
		titleFilter: string,
		userIdFilter: string,
		authDetail: IAuthDetail
	): Promise<ReturnVal> {
		const { currentUser } = authDetail;
		const filters = this.getPendingAdminApprovalFilters(titleFilter, userIdFilter);
		const offset: number = --page * +this.configService.getEntityFetchLimit();

		const posts = await PostEntity.findAndCount({
			skip: offset,
			take: Number(this.configService.getEntityFetchLimit()),
			where: { ...filters, isPendingAdminApproval: true },
			order: {
				updatedAt: 'DESC',
			},
		});
		const postsEntities: PostEntity[] = posts[0];
		const postCount: number = posts[1];
		const postsMap = [];
		for (const post of postsEntities) {
			postsMap.push({
				...post.toJSON(currentUser.timezone, [
					'id',
					'name',
					'title',
					'content',
					'pendingAction',
					'username',
					'timezone',
					'isPendingAdminApproval',
					'status',
					'createdAt',
					'updatedAt',
				]),
			});
		}
		return ReturnVal.success({
			posts: postsMap,
			count: postCount,
		});
	}

	public async createPost(payload: any, authDetail: IAuthDetail): Promise<ReturnVal<Partial<PostEntity>>> {
		const { content, title } = payload;
		const permsRes: IPermsResponse = await this.permissionService.canCreatePosts(title);

		if (!permsRes.success) {
			return ReturnVal.error(permsRes.error, permsRes.httpCode);
		}
		const postEntity = PostEntity.create({
			title,
			content,
			lastModifiedBy: authDetail.currentUser.id,
			userId: authDetail.currentUser.id,
			status: EPostStatus.UNPUBLISHED,
		});
		try {
			await postEntity.save();
			await this.logService.createLog(
				authDetail,
				postEntity.id,
				ELogType.CREATE,
				ELogAction.CREATE_POST,
				ETable.POSTS
			);
			return ReturnVal.success({ ...postEntity.toJSON(authDetail.currentUser.timezone) });
		} catch (e) {
			console.error(`Post could not be created`, e);
			return ReturnVal.error(EMessages.POST_COULD_NOT_BE_CREATED, 500);
		}
	}

	public async deletePost(id: string, authDetail: IAuthDetail): Promise<ReturnVal<Partial<PostEntity>>> {
		const permsRes: IPermsResponse = await this.permissionService.canDeletePost(id, authDetail);
		if (!permsRes.success) {
			return ReturnVal.error(permsRes.error, permsRes.httpCode);
		}

		try {
			const postEntity = await PostEntity.findOne(id);
			const { currentUser } = authDetail;
			if (
				authDetail.currentUser.role === EUserRole.USER ||
				authDetail.currentUser.role === EUserRole.SUPER_ADMIN
			) {
				postEntity.status = EPostStatus.DELETED;
			} else {
				postEntity.pendingAction = EPostPendingAction.DELETE;
				postEntity.isPendingAdminApproval = true;
			}
			postEntity.lastModifiedBy = currentUser.id;
			await postEntity.save();
			await this.logService.createLog(
				authDetail,
				postEntity.id,
				ELogType.DELETE,
				ELogAction.DELETE_POST,
				ETable.POSTS
			);
			return ReturnVal.success({ ...postEntity.toJSON(authDetail.currentUser.timezone) });
		} catch (e) {
			console.error(`Post could not be created`, e);
			return ReturnVal.error(EMessages.POST_COULD_NOT_BE_CREATED, 500);
		}
	}

	public async updatePostStatus(
		status: EPostStatus,
		id: string,
		authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<PostEntity>>> {
		const permsRes: IPermsResponse = await this.permissionService.canUpdatePost(id, authDetail);
		if (!permsRes.success) {
			return ReturnVal.error(permsRes.error, permsRes.httpCode);
		}

		try {
			const postEntity = await PostEntity.findOne(id);
			const { currentUser } = authDetail;

			if (currentUser.role === EUserRole.USER || currentUser.role === EUserRole.SUPER_ADMIN) {
				postEntity.status = status;
			} else {
				if (status === EPostStatus.REJECTED) {
					postEntity.pendingAction = EPostPendingAction.REJECT;
				} else if (status === EPostStatus.UNPUBLISHED) {
					postEntity.pendingAction = EPostPendingAction.UNPUBLISH;
				} else if (status === EPostStatus.PUBLISHED) {
					postEntity.pendingAction = EPostPendingAction.PUBLISH;
				}
				postEntity.isPendingAdminApproval = true;
			}
			postEntity.lastModifiedBy = currentUser.id;
			await postEntity.save();
			await this.logService.createLog(
				authDetail,
				postEntity.id,
				ELogType.UPDATE,
				ELogAction.UPDATE_POST_STATUS,
				ETable.POSTS
			);
			return ReturnVal.success({ ...postEntity.toJSON(authDetail.currentUser.timezone) });
		} catch (e) {
			console.error(`Post could not be created`, e);
			return ReturnVal.error(EMessages.POST_COULD_NOT_BE_CREATED, 500);
		}
	}

	public async updatePost(
		payload: any,
		id: string,
		authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<PostEntity>>> {
		const permsRes: IPermsResponse = await this.permissionService.canUpdatePost(id, authDetail);
		if (!permsRes.success) {
			return ReturnVal.error(permsRes.error, permsRes.httpCode);
		}
		try {
			const postEntity = await PostEntity.findOne(id);
			const { currentUser } = authDetail;
			Object.assign(postEntity, payload);
			postEntity.lastModifiedBy = currentUser.id;
			await postEntity.save();
			await this.logService.createLog(
				authDetail,
				postEntity.id,
				ELogType.UPDATE,
				ELogAction.UPDATE_POST,
				ETable.POSTS
			);
			return ReturnVal.success({ ...postEntity.toJSON(authDetail.currentUser.timezone) });
		} catch (e) {
			console.error(`Post could not be created`, e);
			return ReturnVal.error(EMessages.POST_COULD_NOT_BE_CREATED, 500);
		}
	}

	public async processPendingApprovalRequest(
		id,
		approve: string,
		authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<PostEntity>>> {
		const postEntity = await PostEntity.findOne({
			where: { id, isPendingAdminApproval: true },
		});
		if (!postEntity) {
			return ReturnVal.error(EMessages.INVALID_ID);
		}
		if (approve !== 'true' && approve !== 'false') {
			return ReturnVal.error(EMessages.APPROVE_PARAM_CAN_EITHER_BE_TRUE_OR_FALSE);
		}
		if (approve === 'true') {
			let postApproveAction: ELogAction;
			if (postEntity.pendingAction === EPostPendingAction.DELETE) {
				postEntity.status = EPostStatus.DELETED;
				postApproveAction = ELogAction.APPROVE_POST_DELETE_REQUEST;
			} else if (postEntity.pendingAction === EPostPendingAction.PUBLISH) {
				postEntity.status = EPostStatus.PUBLISHED;
				postApproveAction = ELogAction.APPROVE_POST_UNPUBLISH_REQUEST;
			} else if (postEntity.pendingAction === EPostPendingAction.REJECT) {
				postEntity.status = EPostStatus.REJECTED;
				postApproveAction = ELogAction.APPROVE_POST_DELETE_REQUEST;
			} else if (postEntity.pendingAction === EPostPendingAction.UNPUBLISH) {
				postEntity.status = EPostStatus.UNPUBLISHED;
				postApproveAction = ELogAction.APPROVE_POST_UNPUBLISH_REQUEST;
			}
			postEntity.lastModifiedBy = authDetail.currentUser.id;
			postEntity.pendingAction = null;
			postEntity.isPendingAdminApproval = false;
			await postEntity.save();
			await this.logService.createLog(
				authDetail,
				postEntity.id,
				ELogType.APPROVAL,
				postApproveAction,
				ETable.POSTS
			);
		} else {
			postEntity.isPendingAdminApproval = false;
			postEntity.pendingAction = null;
			await this.logService.createLog(
				authDetail,
				postEntity.id,
				ELogType.REJECT,
				ELogAction.REJECT_POST_CHANGES,
				ETable.POSTS
			);
		}

		return ReturnVal.success({ ...postEntity.toJSON(authDetail.currentUser.timezone) });
	}

	private getFilters(currentUser: UserEntity, titleFilter: string, userIdFilter: string) {
		const filters = [];
		if (titleFilter) {
			filters.push({
				title: ILike(`%${titleFilter}%`),
			});
		}
		if (currentUser.role === EUserRole.USER) {
			filters.push({
				userId: currentUser.id,
				isPendingAdminApproval: false,
				status: In([EPostStatus.UNPUBLISHED, EPostStatus.PUBLISHED, EPostStatus.REJECTED]),
			});
			filters.push({
				isPendingAdminApproval: false,
				status: EPostStatus.PUBLISHED,
			});
		} else {
			filters.push({
				status: In([EPostStatus.UNPUBLISHED, EPostStatus.PUBLISHED, EPostStatus.REJECTED]),
			});
			if (userIdFilter) {
				filters.push({
					userId: userIdFilter,
				});
			}
		}
		return filters;
	}
	private getPendingAdminApprovalFilters(titleFilter: string, userIdFilter: string) {
		const filters = {};
		if (titleFilter) {
			filters['title'] = ILike(`%${titleFilter}%`);
		}

		if (userIdFilter) {
			filters['userId'] = ILike(`%${userIdFilter}%`);
		}
		return filters;
	}
}
