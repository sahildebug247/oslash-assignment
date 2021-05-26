/** @format */

import { Module } from '@nestjs/common';
import PostController from '../controllers/post.controller';
import LogService from '../services/log.service';
import PostPermissionService from '../services/perms/post-perms.service';
import PostService from '../services/post.service';
@Module({
	providers: [PostService, PostPermissionService, LogService],
	exports: [],
	controllers: [PostController],
})
export class PostModule {}
