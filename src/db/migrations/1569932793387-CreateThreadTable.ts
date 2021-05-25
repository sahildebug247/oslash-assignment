/** @format */

import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateThreadTable1569932793387 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CAMPAIGN_THREAD,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['campaign_id', 'credential_id']),
			MigrationUtil.getVarCharColumn({ name: 'linkedin_thread_id' }),
			{
				name: 'last_responded_by',
				type: 'uuid',
				isPrimary: false,
				isNullable: true,
			},
			{
				name: 'added_to_close_by',
				type: 'uuid',
				isPrimary: false,
				isNullable: true,
			},
			MigrationUtil.getVarCharColumn({ name: 'linkedin_thread_id_depricated', isNullable: true }),
			MigrationUtil.getFloat8Column({ name: 'participant_plain_id' }),
			MigrationUtil.getFloat8Column({ name: 'timestamp' }),
			MigrationUtil.getBooleanColumn({ name: 'handled_by_tech' }),
			MigrationUtil.getFloat8Column({ name: 'status' }),
			MigrationUtil.getFloat8Column({ name: 'activity_status' }),
			MigrationUtil.getVarCharColumn({ name: 'participant_name' }),
			MigrationUtil.getVarCharColumn({ name: 'close_url' }),
			MigrationUtil.getJSONBColumn({ name: 'participant_public_identifier' }),
			MigrationUtil.getBooleanColumn({ name: 'is_added_to_close', defaultValue: false }),
			MigrationUtil.getTimeStamptzColumn({ name: 'synced_at', isNullable: true }),
			MigrationUtil.getTimeStamptzColumn({ name: 'follow_up_date', isNullable: true }),
			MigrationUtil.getBooleanColumn({ name: 'follow_up_action', defaultValue: false }),
			MigrationUtil.getTextColumn({ name: 'notes', isNullable: true }),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_THREAD, ETable.CAMPAIGNS, 'campaign_id'),
			MigrationUtil.createForeignKey(
				ETable.CAMPAIGN_THREAD,
				ETable.CAMPAIGN_CREDENTIALS,
				'credential_id'
			),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_THREAD, ETable.USERS, 'last_responded_by'),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_THREAD, ETable.USERS, 'added_to_close_by'),
		],
		uniques: [
			{
				name: 'credential_thread_unique_constraint',
				columnNames: ['credential_id', 'linkedin_thread_id'],
			},
		],
		indices: [
			{
				name: 'campaign_id_index',
				columnNames: ['campaign_id'],
			},
			{
				name: 'credential_id_index',
				columnNames: ['credential_id'],
			},
			{
				name: 'linkedin_thread_id_index',
				columnNames: ['linkedin_thread_id'],
			},
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateThreadTable1569932793387.table);
		await queryRunner.addColumn(
			ETable.CAMPAIGN_THREAD,
			new TableColumn({
				name: 'profile_id',
				type: 'uuid',
				isPrimary: false,
				isNullable: true,
			})
		);
		await queryRunner.createForeignKey(
			ETable.CAMPAIGN_PROFILES,
			new TableForeignKey({
				name: `fk_${ETable.CAMPAIGN_THREAD}_${ETable.CAMPAIGN_PROFILES}_id`,
				columnNames: ['profile_id'],
				referencedColumnNames: ['id'],
				referencedTableName: ETable.CAMPAIGN_THREAD,
				onDelete: 'SET NULL',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateThreadTable1569932793387.table);
	}
}
