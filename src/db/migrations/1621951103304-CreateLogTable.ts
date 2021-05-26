/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import ETable from '../../app/enum/table.enum';
import MigrationUtil from '../../util/migration.util';
export class CreateLogsTable1621951103304 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.LOGS,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['user_id', 'ref_id']),
			MigrationUtil.getVarCharColumn({ name: 'ref_table' }),
			MigrationUtil.getVarCharColumn({ name: 'log_type' }),
			MigrationUtil.getVarCharColumn({ name: 'log_action' }),
		],

		foreignKeys: [MigrationUtil.createForeignKey(ETable.LOGS, ETable.USERS, 'user_id')],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateLogsTable1621951103304.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateLogsTable1621951103304.table);
	}
}
