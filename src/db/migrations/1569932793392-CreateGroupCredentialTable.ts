/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateGroupCredentialTable1569932793392 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.GROUP_CREDENTIAL,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['credential_id', 'group_id', 'created_by']),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.GROUP_CREDENTIAL, ETable.CAMPAIGNS, 'credential_id'),
			MigrationUtil.createForeignKey(ETable.GROUP_CREDENTIAL, ETable.GROUP, 'group_id'),
			MigrationUtil.createForeignKey(ETable.GROUP_CREDENTIAL, ETable.USERS, 'created_by'),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateGroupCredentialTable1569932793392.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateGroupCredentialTable1569932793392.table);
	}
}
