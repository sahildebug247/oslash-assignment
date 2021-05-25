/** @format */

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class AddColumnToProfileDetails1569932793389 implements MigrationInterface {
	private static readonly websiteColumn = new TableColumn(
		MigrationUtil.getJSONBColumn({
			name: 'websites',
		})
	);
	private static readonly birthdateColumn = new TableColumn(
		MigrationUtil.getTimeStamptzColumn({
			name: 'birthdate',
		})
	);
	private static readonly imsColumn = new TableColumn(
		MigrationUtil.getJSONBColumn({
			name: 'ims',
		})
	);
	private static readonly twitterHandleColumn = new TableColumn(
		MigrationUtil.getVarCharColumn({
			name: 'twitter_handle',
			isNullable: true,
		})
	);
	private static readonly addressColumn = new TableColumn(
		MigrationUtil.getVarCharColumn({
			name: 'address',
			isNullable: true,
		})
	);

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.addColumns(ETable.CAMPAIGN_PROFILE_DETAILS, [
			AddColumnToProfileDetails1569932793389.websiteColumn,
			AddColumnToProfileDetails1569932793389.birthdateColumn,
			AddColumnToProfileDetails1569932793389.imsColumn,
			AddColumnToProfileDetails1569932793389.twitterHandleColumn,
			AddColumnToProfileDetails1569932793389.addressColumn,
		]);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropColumns(ETable.CAMPAIGN_PROFILE_DETAILS, [
			AddColumnToProfileDetails1569932793389.websiteColumn,
			AddColumnToProfileDetails1569932793389.birthdateColumn,
			AddColumnToProfileDetails1569932793389.imsColumn,
			AddColumnToProfileDetails1569932793389.twitterHandleColumn,
			AddColumnToProfileDetails1569932793389.addressColumn,
		]);
	}
}
