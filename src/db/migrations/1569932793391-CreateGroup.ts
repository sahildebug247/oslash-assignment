/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateGroupTable1569932793391 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.GROUP,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['created_by']),
			MigrationUtil.getVarCharColumn({ name: 'name' }),
			MigrationUtil.getVarCharColumn({ name: 'url' }),
		],
		foreignKeys: [MigrationUtil.createForeignKey(ETable.GROUP, ETable.USERS, 'created_by')],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateGroupTable1569932793391.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateGroupTable1569932793391.table);
	}
}
