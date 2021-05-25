/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';
import { ECampaignStatus } from '../../app/enum/campaign.enum';

export class CreateCampaignsTable1569932793377 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CAMPAIGNS,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['created_by', 'last_updated_by']),
			MigrationUtil.getVarCharColumn({ name: 'name' }),
			MigrationUtil.getVarCharColumn({
				name: 'status',
				defaultValue: ECampaignStatus.ACTIVE,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'marquee_contact_email',
				defaultValue: ECampaignStatus.ACTIVE,
			}),
			MigrationUtil.getBooleanColumn({
				name: 'is_profile_approval_req',
				defaultValue: false,
			}),
			MigrationUtil.getBooleanColumn({
				name: 'visibility',
				defaultValue: true,
			}),
			MigrationUtil.getBooleanColumn({
				name: 'is_whitelist_applied',
				defaultValue: true,
			}),
			MigrationUtil.getBooleanColumn({
				name: 'is_internal',
				defaultValue: false,
			}),
			MigrationUtil.getJSONBColumn({
				name: 'whitelisted_designation',
			}),
			MigrationUtil.getJSONBColumn({
				name: 'blacklisted_designation',
			}),
			MigrationUtil.getSmallINTColumn({
				name: 'connections_per_url',
				defaultValue: 1,
			}),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CAMPAIGNS, ETable.USERS, 'created_by'),
			MigrationUtil.createForeignKey(ETable.CAMPAIGNS, ETable.USERS, 'last_updated_by'),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCampaignsTable1569932793377.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCampaignsTable1569932793377.table);
	}
}
