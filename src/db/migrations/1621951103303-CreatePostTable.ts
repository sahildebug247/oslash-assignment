/** @format */

import { EPostStatus } from '../../app/enum/post.enum';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import ETable from '../../app/enum/table.enum';
import MigrationUtil from '../../util/migration.util';
export class CreatePostsTable1621951103303 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.POSTS,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['user_id', 'last_modified_by']),
			MigrationUtil.getTextColumn({ name: 'content' }),
			MigrationUtil.getVarCharColumn({ name: 'title' }),
			MigrationUtil.getTimeStamptzColumn({
				name: 'published_at',
				defaultValue: null,
				isNullable: true,
			}),
			MigrationUtil.getVarCharColumn({ name: 'status', defaultValue: EPostStatus.UNPUBLISHED }),
			MigrationUtil.getBooleanColumn({ name: 'is_pending_admin_approval', defaultValue: false }),
			MigrationUtil.getVarCharColumn({
				name: 'pending_action',
				isNullable: true,
			}),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.POSTS, ETable.USERS, 'user_id'),
			MigrationUtil.createForeignKey(ETable.POSTS, ETable.USERS, 'last_modified_by'),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreatePostsTable1621951103303.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreatePostsTable1621951103303.table);
	}
}
