/** @format */
import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import PostEntity from '../../db/entities/post.entity';
import ReturnVal from '../../lib/ReturnVal';
import AuthDetail from '../../util/decorator/controller-Authdetail.decorator';
import HandleReturnVal from '../../util/decorator/handle-returnval.decorator';
import { EPostStatus } from '../enum/post.enum';
import EUserStatus, { EUserRole } from '../enum/user.enum';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';
import IAuthDetail from '../interfaces/authdetail.interface';
import NumberValidationPipe from '../pipes/number-validation.pipe';
import StringValidationPipe from '../pipes/string-validation.pipe';
import ValidationPipe from '../pipes/validation.pipe';
import {
	EntityIdFilterSchema,
	EntityIdSchema,
	PageNumberSchema,
	StringLikeFilterSchema,
} from '../schemas/global.schema';
import { CreatePostSchema, PostStatusRequiredSchema, UpdatePostSchema } from '../schemas/post.schema';
import PostService from '../services/post.service';

@Controller('post')
export default class PostController {
	constructor(private readonly postService: PostService) {}
	/*
        Get Routes
    */

	@Get('admin/pending-approvals')
	@UseGuards(AuthenticationGuard, new RolesGuard([EUserRole.SUPER_ADMIN]))
	@HandleReturnVal
	public async getPendingApprovals(
		@Query('page', new NumberValidationPipe(PageNumberSchema)) page = 1,
		@Query('title', new StringValidationPipe(StringLikeFilterSchema)) titleFilter: string,
		@Query('user', new StringValidationPipe(EntityIdFilterSchema)) userIdFilter: string,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal> {
		return this.postService.getPendingAdminApprovals(page, titleFilter, userIdFilter, authDetail);
	}

	@Get('')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async getPosts(
		@Query('page', new NumberValidationPipe(PageNumberSchema)) page = 1,
		@Query('title', new StringValidationPipe(StringLikeFilterSchema)) titleFilter: string,
		@Query('user', new StringValidationPipe(EntityIdFilterSchema)) userIdFilter: string,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal> {
		return this.postService.getPosts(page, titleFilter, userIdFilter, authDetail);
	}

	/*
        Post Routes
    */
	@Post('')
	@UseGuards(AuthenticationGuard, new RolesGuard([EUserRole.USER]))
	@HandleReturnVal
	public async createPost(
		@Body(new ValidationPipe(CreatePostSchema)) createCampaignSchema: any,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<PostEntity>>> {
		return this.postService.createPost(createCampaignSchema, authDetail);
	}

	/*
      Delete Routes
    */
	@Delete('')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async deletePost(
		@Query('id', new StringValidationPipe(EntityIdSchema)) id: string,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<PostEntity>>> {
		return this.postService.deletePost(id, authDetail);
	}
	/*
      Put Routes
    */
	@Put('admin/approve-request')
	@UseGuards(AuthenticationGuard, new RolesGuard([EUserRole.SUPER_ADMIN]))
	@HandleReturnVal
	public async approvePendingRequest(
		@Query('id', new StringValidationPipe(EntityIdSchema)) id: string,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<PostEntity>>> {
		return this.postService.approvePendingRequest(id, authDetail);
	}

	@Put('status')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async updatePostStatus(
		@Query('id', new StringValidationPipe(EntityIdSchema)) id: string,
		@Query('status', new StringValidationPipe(PostStatusRequiredSchema)) status: EPostStatus,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<PostEntity>>> {
		return this.postService.updatePostStatus(status, id, authDetail);
	}

	@Put('')
	@UseGuards(AuthenticationGuard, new RolesGuard([EUserRole.USER]))
	@HandleReturnVal
	public async updatePost(
		@Query('id', new StringValidationPipe(EntityIdSchema)) id: string,
		@Body(new ValidationPipe(UpdatePostSchema)) payload: any,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<PostEntity>>> {
		return this.postService.updatePost(payload, id, authDetail);
	}
}
