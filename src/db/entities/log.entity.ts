/** @format */

import { IsIn, IsUUID } from 'class-validator';
import { ELogAction, ELogType } from '../../app/enum/log.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import ETable from '../../app/enum/table.enum';
import ModelEntity from './model.entity';
import UserEntity from './user.entity';

@Entity({ name: ETable.LOGS })
class LogEntity extends ModelEntity<LogEntity> {
	@IsUUID()
	@Column({ name: 'user_id', type: 'uuid' })
	public userId: string;

	@IsUUID()
	@Column({ name: 'ref_id', type: 'uuid' })
	public refId: string;

	@IsIn(Object.values(ETable))
	@Column({ name: 'ref_table', type: 'uuid' })
	public refTable: ETable;

	@IsIn(Object.values(ELogType))
	@Column({ name: 'log_type', type: 'uuid' })
	public logType: string;

	@IsIn(Object.values(ELogAction))
	@Column({ name: 'log_action', type: 'uuid' })
	public logAction: string;

	@ManyToOne(() => UserEntity, { lazy: true })
	@JoinColumn({ name: 'user_id' })
	public user: Promise<UserEntity>;

	public toJSON(
		timezone = 'utc',
		includes = ['id', 'userId', 'refId', 'refTable', 'logType', 'logAction', 'createdAt', 'updatedAt'],
		skips = []
	): Partial<LogEntity> {
		const d = super.toJSON(timezone, includes, skips);

		return d;
	}
}

export default LogEntity;
