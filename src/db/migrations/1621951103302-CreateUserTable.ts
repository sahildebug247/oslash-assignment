/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';
import EUserStatus, { EUserRole } from '../../app/enum/user.enum';
export class CreateUsersTable1621951103302 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.USERS,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			MigrationUtil.getVarCharColumn({ name: 'name' }),
			MigrationUtil.getVarCharColumn({ name: 'role', defaultValue: EUserRole.USER }),
			MigrationUtil.getCiTtextColumn({ name: 'username', isUnique: true }),
			MigrationUtil.getVarCharColumn({ name: 'password', isNullable: false }),
			MigrationUtil.getVarCharColumn({ name: 'timezone' }),
			MigrationUtil.getVarCharColumn({
				name: 'status',
				defaultValue: EUserStatus.ACTIVE,
			}),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateUsersTable1621951103302.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateUsersTable1621951103302.table);
	}
}
