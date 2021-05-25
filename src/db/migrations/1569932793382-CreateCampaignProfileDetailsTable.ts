/** @format */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCampaignProfileDetailsTable1569932793382 implements MigrationInterface {
	private static readonly table = new Table({
		name: ETable.CAMPAIGN_PROFILE_DETAILS,
		columns: [
			...MigrationUtil.getIDAndDatesColumns(),
			MigrationUtil.getVarCharColumn({
				name: 'phone',
				isNullable: false,
				defaultValue: '',
			}),
			MigrationUtil.getVarCharColumn({
				name: 'public_identifier',
				isNullable: false,
				isUnique: true,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'name',
				isNullable: false,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'first_name',
				isNullable: false,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'last_name',
				isNullable: false,
			}),
			MigrationUtil.getTextColumn({
				name: 'pic_url',
				isNullable: false,
				defaultValue: '',
			}),
			MigrationUtil.getTextColumn({
				name: 'profile_url',
				isNullable: false,
			}),
			MigrationUtil.getINTColumn({
				name: 'plain_id',
				isNullable: true,
				isUnique: true,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'email',
				isNullable: false,
				defaultValue: '',
			}),
			MigrationUtil.getVarCharColumn({
				name: 'description',
				isNullable: false,
			}),
			MigrationUtil.getVarCharColumn({
				name: 'location',
				isNullable: false,
			}),
		],
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createTable(CreateCampaignProfileDetailsTable1569932793382.table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable(CreateCampaignProfileDetailsTable1569932793382.table);
	}
}
