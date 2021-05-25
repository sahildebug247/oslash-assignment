/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCSVRecordTable1569932793396 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CSV_RECORD,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['credential_id', 'campaign_id', 'uploaded_by']),
			MigrationUtil.getVarCharColumn({ name: 'file_name', isNullable: false }),
			MigrationUtil.getSmallINTColumn({ name: 'repeating_urls', isNullable: false }),
			MigrationUtil.getSmallINTColumn({ name: 'invalid_urls', isNullable: false }),
			MigrationUtil.getSmallINTColumn({ name: 'urls_inserted', isNullable: false }),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CSV_RECORD, ETable.USERS, 'uploaded_by'),
			MigrationUtil.createForeignKey(ETable.CSV_RECORD, ETable.CAMPAIGNS, 'campaign_id'),
			MigrationUtil.createForeignKey(ETable.CSV_RECORD, ETable.CAMPAIGN_CREDENTIALS, 'credential_id'),
		],
		uniques: [
			{
				name: 'file_name__credential_id',
				columnNames: ['file_name', 'credential_id'],
			},
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCSVRecordTable1569932793396.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCSVRecordTable1569932793396.table);
	}
}
