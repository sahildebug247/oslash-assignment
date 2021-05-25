/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCampaignCredentialsTable1569932793378 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CAMPAIGN_CREDENTIALS,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['created_by', 'last_updated_by', 'campaign_id']),
			MigrationUtil.getVarCharColumn({ name: 'email', isNullable: false }),
			MigrationUtil.getVarCharColumn({ name: 'close_user_id', isNullable: true }),
			MigrationUtil.getVarCharColumn({
				name: 'calendly_url',
				isNullable: true,
			}),
			MigrationUtil.getVarCharColumn({ name: 'name', isNullable: false }),
			MigrationUtil.getVarCharColumn({ name: 'password', isNullable: false }),
			MigrationUtil.getVarCharColumn({ name: 'tracking_secret', isNullable: false }),
			MigrationUtil.getVarCharColumn({ name: 'last_status', isNullable: true }),
			MigrationUtil.getBooleanColumn({ name: 'is_premium', defaultValue: false }),
			MigrationUtil.getBooleanColumn({ name: 'creating_deployment', defaultValue: false }),
			MigrationUtil.getVarCharColumn({ name: 'two_fa_secret', isNullable: true }),
			MigrationUtil.getSmallINTColumn({
				name: 'failed_login_attempts',
				defaultValue: 0,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'navigation_err_count',
				defaultValue: 0,
			}),
			MigrationUtil.getINTColumn({
				name: 'connection_strength',
				isNullable: true,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'url_scrap_err_count',
				defaultValue: 0,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'rec_email_err_count',
				defaultValue: 0,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'chat_refresh_req_sent_today',
				defaultValue: 0,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'posts_req_made_today',
				defaultValue: 0,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'chat_res_sent_today',
				defaultValue: 0,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'connection_send_err_count',
				defaultValue: 0,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'followup_send_err_count',
				defaultValue: 0,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'inbox_sync_err_count',
				defaultValue: 0,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'url_scrap_limit',
				defaultValue: 15,
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'connection_send_limit',
				defaultValue: 20,
			}),
			MigrationUtil.getFloat8Column({
				name: 'last_thread_sync',
				defaultValue: null,
				isNullable: true,
			}),
			MigrationUtil.getTimeStamptzColumn({
				name: 'first_login',
				defaultValue: null,
				isNullable: true,
			}),
			MigrationUtil.getVarCharColumn({ name: 'status', isNullable: false }),
			MigrationUtil.getBooleanColumn({
				name: 'is_deployed',
				defaultValue: false,
			}),
			MigrationUtil.getBooleanColumn({
				name: 'is_loggedin',
				defaultValue: false,
			}),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_CREDENTIALS, ETable.USERS, 'created_by'),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_CREDENTIALS, ETable.USERS, 'last_updated_by'),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_CREDENTIALS, ETable.CAMPAIGNS, 'campaign_id'),
		],
		uniques: [
			{
				name: 'campaign_email',
				columnNames: ['email', 'campaign_id'],
			},
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCampaignCredentialsTable1569932793378.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCampaignCredentialsTable1569932793378.table);
	}
}
