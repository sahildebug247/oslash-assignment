/** @format */

import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCloseIOTable1569932793399 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CLOSE_IO,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			...MigrationUtil.getFKColumns(['created_by', 'last_updated_by']),
			MigrationUtil.getVarCharColumn({ name: 'name', isNullable: false }),
			MigrationUtil.getVarCharColumn({ name: 'email', isNullable: false }),
			MigrationUtil.getVarCharColumn({ name: 'timezone', isNullable: false }),
			MigrationUtil.getVarCharColumn({ name: 'close_id', isNullable: false, isUnique: true }),
			MigrationUtil.getTextColumn({ name: 'calendly', isNullable: true, isUnique: true }),
			MigrationUtil.getVarCharColumn({ name: 'status', isNullable: false }),
		],
		foreignKeys: [
			MigrationUtil.createForeignKey(ETable.CLOSE_IO, ETable.USERS, 'created_by'),
			MigrationUtil.createForeignKey(ETable.CLOSE_IO, ETable.USERS, 'last_updated_by'),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCloseIOTable1569932793399.table);
		await queryRunner.addColumn(
			ETable.CAMPAIGN_CREDENTIALS,
			new TableColumn({
				name: 'close_id',
				type: 'uuid',
				isPrimary: false,
				isNullable: true,
			})
		);
		await queryRunner.createForeignKey(
			ETable.CAMPAIGN_CREDENTIALS,
			new TableForeignKey({
				name: `fk_${ETable.CAMPAIGN_CREDENTIALS}_${ETable.CLOSE_IO}_id`,
				columnNames: ['close_id'],
				referencedColumnNames: ['id'],
				referencedTableName: ETable.CLOSE_IO,
				onDelete: 'SET NULL',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCloseIOTable1569932793399.table);
		await queryRunner.dropColumn(ETable.CAMPAIGN_CREDENTIALS, 'close_id');
	}
}
