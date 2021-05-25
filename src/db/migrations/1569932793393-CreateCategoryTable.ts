/** @format */

import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCategoryTable1569932793393 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CATEGORY,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			MigrationUtil.getVarCharColumn({ name: 'name' }),
			...MigrationUtil.getFKColumns(['created_by']),
		],
		foreignKeys: [MigrationUtil.createForeignKey(ETable.CATEGORY, ETable.USERS, 'created_by')],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCategoryTable1569932793393.table);
		await queryRunner.addColumn(
			ETable.CATEGORY,
			new TableColumn({
				name: 'category_id',
				type: 'uuid',
				isPrimary: false,
				isNullable: true,
			})
		);
		await queryRunner.createForeignKey(
			ETable.CAMPAIGNS,
			new TableForeignKey({
				name: `fk_${ETable.CAMPAIGNS}_${ETable.CATEGORY}_category_id`,
				columnNames: ['category_id'],
				referencedColumnNames: ['id'],
				referencedTableName: ETable.CATEGORY,
				onDelete: 'SET NULL',
			})
		);
		await queryRunner.addColumn(
			ETable.CAMPAIGN_URLS,
			new TableColumn({
				name: 'category_id',
				type: 'uuid',
				isPrimary: false,
				isNullable: true,
			})
		);
		await queryRunner.createForeignKey(
			ETable.CAMPAIGN_URLS,
			new TableForeignKey({
				name: `fk_${ETable.CAMPAIGN_URLS}_${ETable.CATEGORY}_category_id`,
				columnNames: ['category_id'],
				referencedColumnNames: ['id'],
				referencedTableName: ETable.CATEGORY,
				onDelete: 'SET NULL',
			})
		);
		await queryRunner.addColumn(
			ETable.CAMPAIGN_PROFILES,
			new TableColumn({
				name: 'category_id',
				type: 'uuid',
				isPrimary: false,
				isNullable: true,
			})
		);
		await queryRunner.createForeignKey(
			ETable.CAMPAIGN_PROFILES,
			new TableForeignKey({
				name: `fk_${ETable.CAMPAIGN_PROFILES}_${ETable.CATEGORY}_category_id`,
				columnNames: ['category_id'],
				referencedColumnNames: ['id'],
				referencedTableName: ETable.CATEGORY,
				onDelete: 'SET NULL',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCategoryTable1569932793393.table);
	}
}
