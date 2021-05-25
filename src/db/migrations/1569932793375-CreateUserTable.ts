/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';
import EUserStatus, { EUserInterfaceTheme, EUserRole } from '../../app/enum/user.enum';

export class CreateUsersTable1569932793375 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.USERS,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			MigrationUtil.getVarCharColumn({ name: 'name' }),
			MigrationUtil.getVarCharColumn({ name: 'email', isUnique: true }),
			MigrationUtil.getVarCharColumn({ name: 'role', defaultValue: EUserRole.USER }),
			MigrationUtil.getVarCharColumn({ name: 'username', isUnique: true }),
			MigrationUtil.getVarCharColumn({ name: 'password', isNullable: false }),
			MigrationUtil.getTimeStamptzColumn({
				name: 'last_login',
				isNullable: false,
			}),
			MigrationUtil.getVarCharColumn({ name: 'timezone' }),
			MigrationUtil.getVarCharColumn({
				name: 'status',
				defaultValue: EUserStatus.ACTIVE,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'interface_theme',
				defaultValue: EUserInterfaceTheme.LIGHT,
			}),
			MigrationUtil.getBooleanColumn({
				name: 'email_verified',
				defaultValue: false,
			}),
			MigrationUtil.getJSONBColumn({ name: 'email_attributes' }),
			MigrationUtil.getJSONBColumn({ name: 'password_attributes' }),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateUsersTable1569932793375.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateUsersTable1569932793375.table);
	}
}
