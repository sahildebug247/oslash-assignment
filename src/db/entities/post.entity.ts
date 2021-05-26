/** @format */

import { IsBoolean, IsIn, IsString, IsUUID } from 'class-validator';
import { EPostPendingAction, EPostStatus } from '../../app/enum/post.enum';
import MomentUtil from '../../util/moment.util';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import ETable from '../../app/enum/table.enum';
import ModelEntity from './model.entity';
import UserEntity from './user.entity';

@Entity({ name: ETable.POSTS })
class PostEntity extends ModelEntity<PostEntity> {
	@IsUUID()
	@Column({ name: 'user_id', type: 'uuid' })
	public userId: string;

	@IsUUID()
	@Column({ name: 'last_modified_by', type: 'uuid' })
	public lastModifiedBy: string;

	@IsString()
	@Column()
	public content: string;

	@IsString()
	@Column()
	public title: string;

	@Column({ name: 'published_at' })
	public publishedAt: Date;

	@IsIn(Object.values(EPostStatus))
	@Column({ default: EPostStatus.UNPUBLISHED })
	public status: EPostStatus;

	@IsBoolean()
	@Column({ name: 'is_pending_admin_approval' })
	public isPendingAdminApproval: boolean;

	@IsIn(Object.values(EPostPendingAction))
	@Column({ name: 'pending_action' })
	public pendingAction: EPostPendingAction | null;

	@ManyToOne(() => UserEntity, { lazy: true })
	@JoinColumn({ name: 'last_modified_by' })
	public modifiedByUser: Promise<UserEntity>;

	@ManyToOne(() => UserEntity, { lazy: true })
	@JoinColumn({ name: 'user_id' })
	public user: Promise<UserEntity>;

	public toJSON(
		timezone = 'utc',
		includes = [
			'id',
			'name',
			'title',
			'content',
			'username',
			'timezone',
			'isPendingAdminApproval',
			'status',
			'createdAt',
			'updatedAt',
		],
		skips = []
	): Partial<PostEntity> {
		const d = super.toJSON(timezone, includes, skips);
		if (d['publishedAt']) {
			d['publishedAt'] = MomentUtil.convertToDefaultTimezoneString(this.publishedAt, timezone);
		}
		return d;
	}
}

export default PostEntity;
