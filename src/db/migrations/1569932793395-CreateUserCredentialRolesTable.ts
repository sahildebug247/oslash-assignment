/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateUserCredentialManager1569932793395 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.USER_CAMPAIGN_MANAGER,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['user_id', 'campaign_id']),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.USER_CAMPAIGN_MANAGER, ETable.USERS, 'user_id'),
			MigrationUtil.createForeignKey(ETable.USER_CAMPAIGN_MANAGER, ETable.CAMPAIGNS, 'campaign_id'),
		],
		uniques: [
			{
				name: 'campaign_user',
				columnNames: ['campaign_id', 'user_id'],
			},
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateUserCredentialManager1569932793395.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateUserCredentialManager1569932793395.table);
	}
}
