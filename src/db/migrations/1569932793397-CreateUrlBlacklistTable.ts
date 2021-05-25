/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateUrlBlacklistTable1569932793397 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.URL_BLACKLIST,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['campaign_id'], true),
			...MigrationUtil.getFKColumns(['uploaded_by']),
			MigrationUtil.getVarCharColumn({ name: 'url', isNullable: false }),
			MigrationUtil.getFloat8Column({ name: 'plain_id', isNullable: true }),
			MigrationUtil.getBooleanColumn({
				name: 'is_fulfilled',
				isNullable: false,
				defaultValue: false,
			}),
			MigrationUtil.getVarCharColumn({ name: 'mini_profile', isNullable: true }),
			MigrationUtil.getVarCharColumn({ name: 'status', isNullable: false }),
			MigrationUtil.getBooleanColumn({
				name: 'is_global',
				isNullable: false,
				defaultValue: false,
			}),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.URL_BLACKLIST, ETable.CAMPAIGNS, 'campaign_id'),
			MigrationUtil.createForeignKey(ETable.URL_BLACKLIST, ETable.USERS, 'uploaded_by'),
		],
		uniques: [
			{
				name: 'campaign_id__url',
				columnNames: ['campaign_id', 'url'],
			},
		],
		indices: [
			{
				name: 'campaign_id_blacklist__index',
				columnNames: ['campaign_id'],
			},
			{
				name: 'is_fulfilled__campaign_id',
				columnNames: ['campaign_id', 'is_fulfilled'],
			},
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateUrlBlacklistTable1569932793397.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateUrlBlacklistTable1569932793397.table);
	}
}
