/** @format */

import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';
import { TableForeignKey } from 'typeorm';
import { TableUnique } from 'typeorm/schema-builder/table/TableUnique';

class MigrationUtil {
	public static getIDAndDatesColumns(): TableColumnOptions[] {
		const columns: TableColumnOptions[] = [];
		columns.push({
			name: 'id',
			type: 'uuid',
			isPrimary: true,
			isNullable: false,
			isGenerated: true,
			generationStrategy: 'uuid',
		});

		columns.push({
			name: 'created_at',
			type: 'timestamptz',
			isPrimary: false,
			isNullable: false,
			default: 'now()',
		});

		columns.push({
			name: 'updated_at',
			type: 'timestamptz',
			isPrimary: false,
			isNullable: false,
			default: 'now()',
		});
		return columns;
	}

	public static getUUIDColumn({
		name,
		isPrimary = false,
		isNullable = false,
		isUnique = false,
		defaultValue = 'uuid_generate_v4()',
	}): TableColumnOptions {
		if (defaultValue === null) {
			return {
				name,
				isPrimary,
				isNullable,
				type: 'uuid',
			};
		}
		return {
			name,
			isPrimary,
			isNullable,
			default: defaultValue,
			type: 'uuid',
		};
	}

	public static getCiTtextColumn({
		name,
		isPrimary = false,
		isNullable = false,
		defaultValue = null,
		isUnique = false,
	}): TableColumnOptions {
		if (!isNullable) {
			return {
				name,
				isPrimary,
				isNullable,
				isUnique,
				type: 'citext',
			};
		}
		return {
			name,
			isPrimary,
			isNullable,
			isUnique,
			default: defaultValue,
			type: 'citext',
		};
	}
	public static getVarCharColumn({
		name,
		length = '255',
		isPrimary = false,
		isNullable = false,
		isUnique = false,
		defaultValue = null,
		isArray = false,
	}): TableColumnOptions {
		if (!isNullable) {
			return {
				name,
				length,
				isPrimary,
				isNullable,
				isUnique,
				isArray,
				type: 'varchar',
			};
		}
		return {
			name,
			length,
			isPrimary,
			isNullable,
			isUnique,
			isArray,
			default: defaultValue,
			type: 'varchar',
		};
	}

	public static getArrayVarcharColumn({
		name,
		length = '255',
		isPrimary = false,
		isUnique = false,
		defaultValue = `'{}'::varchar[]`,
	}): TableColumnOptions {
		return {
			name,
			length,
			isPrimary,
			isUnique,
			isArray: true,
			default: defaultValue,
			type: 'varchar',
		};
	}
	public static getArrayTextColumn({
		name,
		isPrimary = false,
		isNullable = false,
		isUnique = false,
		defaultValue = `'{}'::varchar[]`,
	}): TableColumnOptions {
		return {
			name,
			isPrimary,
			isNullable,
			isUnique,
			type: 'text',
			isArray: true,
			default: defaultValue,
		};
	}
	public static getTextColumn({
		name,
		isPrimary = false,
		isNullable = false,
		isUnique = false,
		defaultValue = null,
	}): TableColumnOptions {
		if (!isNullable) {
			return {
				name,
				isPrimary,
				isNullable,
				isUnique,
				type: 'text',
			};
		}

		return {
			name,
			isPrimary,
			isNullable,
			isUnique,
			default: `'${defaultValue}'`,
			type: 'text',
		};
	}
	public static getJSONBColumn({ name, defaultValue = '{}' }): TableColumnOptions {
		return {
			name,
			type: 'jsonb',
			isPrimary: false,
			isNullable: false,
			default: `'${defaultValue}'`,
		};
	}

	public static getBooleanColumn({ name, isNullable = false, defaultValue = false }): TableColumnOptions {
		return {
			name,
			isNullable,
			default: defaultValue,
			type: 'boolean',
		};
	}

	public static getSmallINTColumn({
		name,
		defaultValue = null,
		isNullable = false,
		isUnique = false,
		isPrimary = false,
	}): TableColumnOptions {
		return {
			name,
			type: 'smallint',
			isUnique,
			isPrimary,
			default: defaultValue,
			isNullable,
		};
	}

	public static getINTColumn({
		name,
		defaultValue = null,
		isNullable = false,
		isUnique = false,
		isPrimary = false,
	}): TableColumnOptions {
		return {
			name,
			type: 'int',
			isUnique,
			isPrimary,
			default: defaultValue,
			isNullable,
		};
	}

	public static getFloat8Column({
		name,
		defaultValue = null,
		isNullable = false,
		isUnique = false,
		isPrimary = false,
	}): TableColumnOptions {
		return {
			name,
			type: 'float8',
			isUnique,
			isPrimary,
			default: defaultValue,
			isNullable,
		};
	}
	public static getTimeStamptzColumn({
		name,
		defaultValue = 'now()',
		isNullable = false,
		isUnique = false,
		isPrimary = false,
	}): TableColumnOptions {
		return {
			name,
			type: 'timestamptz',
			isUnique,
			isPrimary,
			default: defaultValue,
			isNullable,
		};
	}
	public static getDateOnlyColumn({
		name,
		defaultValue = 'now()',
		isNullable = false,
		isUnique = false,
		isPrimary = false,
	}): TableColumnOptions {
		return {
			name,
			type: 'date',
			isUnique,
			isPrimary,
			default: defaultValue,
			isNullable,
		};
	}

	public static getFKColumns(columnNames: string[], isNullable = false): TableColumnOptions[] {
		const columns: TableColumnOptions[] = columnNames.map<TableColumnOptions>((columnName) => {
			return {
				name: columnName,
				type: 'uuid',
				isPrimary: false,
				isNullable: isNullable || false,
			};
		});
		return columns;
	}

	public static createForeignKey(
		relationTable: string,
		referenceTable: string,
		columnName: string,
		referenceColumnName?: string,
		name?: string
	): TableForeignKey {
		name = name || `fk_${referenceTable}_${relationTable}_${columnName}`;
		referenceColumnName = referenceColumnName || 'id';
		return new TableForeignKey({
			name,
			columnNames: [columnName],
			referencedColumnNames: [referenceColumnName],
			referencedTableName: referenceTable,
			onDelete: 'CASCADE',
		});
	}

	public static createUniqueIndex(table: string, columnNames: string[], name?: string): TableUnique {
		name = name || `uq_${table}_${columnNames.join('_')}`;
		return new TableUnique({ name, columnNames });
	}
}

export default MigrationUtil;
