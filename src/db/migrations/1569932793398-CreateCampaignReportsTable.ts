/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCampaignReportTable1569932793398 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CAMPAIGN_REPORT,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['campaign_id', 'credential_id']),
			MigrationUtil.getVarCharColumn({ name: 'cred_status', isNullable: false }),
			MigrationUtil.getSmallINTColumn({ name: 'profiles_connected', isNullable: false }),
			MigrationUtil.getSmallINTColumn({ name: 'profiles_engaged', isNullable: false }),
			MigrationUtil.getSmallINTColumn({ name: 'connections_sent', isNullable: false }),
			MigrationUtil.getSmallINTColumn({ name: 'followups_sent', isNullable: false }),
			MigrationUtil.getDateOnlyColumn({ name: 'report_date', isNullable: false }),
			MigrationUtil.getBooleanColumn({
				name: 'url_required',
				isNullable: false,
				defaultValue: false,
			}),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_REPORT, ETable.CAMPAIGNS, 'campaign_id'),
			MigrationUtil.createForeignKey(
				ETable.CAMPAIGN_REPORT,
				ETable.CAMPAIGN_CREDENTIALS,
				'credential_id'
			),
		],
		uniques: [
			{
				name: 'credential_id__created_at',
				columnNames: ['credential_id', 'created_at'],
			},
		],
		indices: [
			{
				name: 'report_date__index',
				columnNames: ['report_date'],
			},
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCampaignReportTable1569932793398.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCampaignReportTable1569932793398.table);
	}
}
