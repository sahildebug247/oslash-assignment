/** @format */

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCampaignPostTable1569932793390 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CAMPAIGN_POST,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['campaign_id', 'credential_id', 'group_id', 'created_by']),
			MigrationUtil.getVarCharColumn({ name: 'title' }),
			MigrationUtil.getVarCharColumn({ name: 'type' }),
			MigrationUtil.getTextColumn({ name: 'content' }),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_POST, ETable.CAMPAIGNS, 'campaign_id'),
			MigrationUtil.createForeignKey(
				ETable.CAMPAIGN_POST,
				ETable.CAMPAIGN_CREDENTIALS,
				'credential_id'
			),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_POST, ETable.USERS, 'created_by'),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCampaignPostTable1569932793390.table);
		await queryRunner.createForeignKey(
			ETable.CAMPAIGN_POST,
			new TableForeignKey({
				name: `fk_${ETable.CAMPAIGN_POST}_${ETable.GROUP}_group_id`,
				columnNames: ['group_id'],
				referencedColumnNames: ['id'],
				referencedTableName: ETable.CATEGORY,
				onDelete: 'SET NULL',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCampaignPostTable1569932793390.table);
	}
}
