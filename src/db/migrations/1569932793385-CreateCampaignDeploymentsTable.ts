/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCampaignDeploymentsTable1569932793385 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CAMPAIGN_DEPLOYMENTS,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['campaign_id', 'credential_id', 'last_updated_by', 'created_by']),
			MigrationUtil.getVarCharColumn({ name: 'instance_id' }),
			MigrationUtil.getVarCharColumn({ name: 'api_key' }),
			MigrationUtil.getVarCharColumn({ name: 'ip_v4' }),
			MigrationUtil.getVarCharColumn({ name: 'status' }),
			MigrationUtil.getBooleanColumn({ name: 'runner_registered', defaultValue: false }),
			MigrationUtil.getVarCharColumn({ name: 'elastic_ip' }),
			MigrationUtil.getVarCharColumn({ name: 'instance_type' }),
			MigrationUtil.getVarCharColumn({ name: 'availability_zone' }),
			MigrationUtil.getVarCharColumn({ name: 'security_group' }),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_DEPLOYMENTS, ETable.USERS, 'created_by'),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_DEPLOYMENTS, ETable.USERS, 'last_updated_by'),
			MigrationUtil.createForeignKey(ETable.CAMPAIGN_DEPLOYMENTS, ETable.CAMPAIGNS, 'campaign_id'),
			MigrationUtil.createForeignKey(
				ETable.CAMPAIGN_DEPLOYMENTS,
				ETable.CAMPAIGN_CREDENTIALS,
				'credential_id'
			),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCampaignDeploymentsTable1569932793385.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCampaignDeploymentsTable1569932793385.table);
	}
}
