/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';
import ECampaignURLStatus from '../../app/enum/campaign-url-status.enum';

export class CreateCampaignURLsTable1569932793380 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CAMPAIGN_URLS,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['created_by', 'last_updated_by', 'campaign_id', 'credential_id']),
			MigrationUtil.getVarCharColumn({
				name: 'status',
				defaultValue: ECampaignURLStatus.NOT_SCRAPED,
			}),
			MigrationUtil.getVarCharColumn({ name: 'type', isNullable: false }),
			MigrationUtil.getVarCharColumn({ name: 'url', isNullable: false }),
			MigrationUtil.getTimeStamptzColumn({
				name: 'scraped_on',
				isNullable: true,
				defaultValue: null,
			}),
			MigrationUtil.getBooleanColumn({
				name: 'is_fulfilled',
				defaultValue: false,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'page_to_scrap',
				isNullable: true,
				defaultValue: null,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'targed_pagination_no',
				isNullable: true,
				defaultValue: null,
			}),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_URLS, ETable.USERS, 'created_by'),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_URLS, ETable.USERS, 'last_updated_by'),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_URLS, ETable.CAMPAIGNS, 'campaign_id'),
			MigrationUtil.createForeignKey(
				ETable.CAMPAIGN_URLS,
				ETable.CAMPAIGN_CREDENTIALS,
				'credential_id'
			),
		],
		uniques: [
			{
				name: 'campaign_url',
				columnNames: ['url', 'campaign_id'],
			},
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCampaignURLsTable1569932793380.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCampaignURLsTable1569932793380.table);
	}
}
