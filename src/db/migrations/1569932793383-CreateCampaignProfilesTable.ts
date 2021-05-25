/** @format */

import { MigrationInterface, QueryRunner, Table, Column } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';
import { ECampaignProfileApproval } from '../../app/enum/campaign.enum';

export class CreateCampaignProfilesTable1569932793383 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CAMPAIGN_PROFILES,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns([
				'campaign_id',
				'credential_in_use',
				'profile_detail_id',
				'url_id',
			]),
			MigrationUtil.getVarCharColumn({
				name: 'public_identifier',
				isNullable: false,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'profile_approval',
				defaultValue: ECampaignProfileApproval.APPROVED,
			}),
			MigrationUtil.getINTColumn({
				name: 'plain_id',
				isNullable: true,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'connection_priority',
				isNullable: true,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'status',
				isNullable: false,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'mini_profile',
				isNullable: false,
				defaultValue: '',
			}),
			MigrationUtil.getBooleanColumn({
				name: 'connection_sent',
				isNullable: false,
			}),
			MigrationUtil.getTimeStamptzColumn({
				name: 'connection_sent_date',
				isNullable: true,
				defaultValue: null,
			}),
			MigrationUtil.getTimeStamptzColumn({
				name: 'connection_retraction_date',
				isNullable: true,
				defaultValue: null,
			}),
			MigrationUtil.getBooleanColumn({
				name: 'is_connected',
				isNullable: false,
			}),
			MigrationUtil.getBooleanColumn({ name: 'is_engaged', isNullable: false }),
			MigrationUtil.getTimeStamptzColumn({
				name: 'last_follow_up_date',
				isNullable: true,
				defaultValue: null,
			}),
			MigrationUtil.getTimeStamptzColumn({
				name: 'details_sync_timestamp',
				isNullable: true,
				defaultValue: null,
			}),
			MigrationUtil.getTimeStamptzColumn({
				name: 'connected_on_date',
				isNullable: true,
				defaultValue: null,
			}),
			MigrationUtil.getTimeStamptzColumn({
				name: 'engaged_on_date',
				isNullable: true,
				defaultValue: null,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'last_follow_up_priority',
				isNullable: true,
			}),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_PROFILES, ETable.CAMPAIGNS, 'campaign_id'),
			MigrationUtil.createForeignKey(
				ETable.CAMPAIGN_PROFILES,
				ETable.CAMPAIGN_CREDENTIALS,
				'credential_in_use'
			),
			MigrationUtil.createForeignKey(
				ETable.CAMPAIGN_PROFILES,
				ETable.CAMPAIGN_PROFILE_DETAILS,
				'profile_detail_id'
			),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_PROFILES, ETable.CAMPAIGN_URLS, 'url_id'),
		],
		uniques: [
			{
				name: 'campaign_profile',
				columnNames: ['campaign_id', 'public_identifier'],
			},
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCampaignProfilesTable1569932793383.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCampaignProfilesTable1569932793383.table);
	}
}
