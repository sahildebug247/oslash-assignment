/** @format */

import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateScheduledFollowupTable1569932793394 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.SCHEDULED_FOLLOWUP,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			MigrationUtil.getTextColumn({ name: 'content' }),
			MigrationUtil.getVarCharColumn({ name: 'status' }),
			MigrationUtil.getVarCharColumn({ name: 'rejected_reason', isNullable: true }),
			MigrationUtil.getFloat8Column({ name: 'thread_timestamp' }),
			MigrationUtil.getTimeStamptzColumn({ name: 'timestamp', defaultValue: null }),
			...MigrationUtil.getFKColumns(['created_by', 'thread_id', 'credential_id']),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.SCHEDULED_FOLLOWUP, ETable.USERS, 'created_by'),
			MigrationUtil.createForeignKey(ETable.SCHEDULED_FOLLOWUP, ETable.CAMPAIGN_THREAD, 'thread_id'),
			MigrationUtil.createForeignKey(
				ETable.SCHEDULED_FOLLOWUP,
				ETable.CAMPAIGN_CREDENTIALS,
				'credential_id'
			),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateScheduledFollowupTable1569932793394.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateScheduledFollowupTable1569932793394.table);
	}
}
