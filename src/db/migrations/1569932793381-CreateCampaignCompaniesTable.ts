import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCampaignCompaniesTable1569932793381
  implements MigrationInterface {
  private static readonly table = new Table({
    name: ETable.CAMPAIGN_COMPANIES,
    columns: [
      ...MigrationUtil.getIDAndDatesColumns(),
      ...MigrationUtil.getFKColumns(['url_id']),
      MigrationUtil.getVarCharColumn({ name: 'name', isNullable: false }),
      MigrationUtil.getVarCharColumn({
        name: 'headquartered_at',
        isNullable: false,
      }),
      MigrationUtil.getSmallINTColumn({ name: 'size', isNullable: false }),
      MigrationUtil.getSmallINTColumn({ name: 'founded', isNullable: false }),
      MigrationUtil.getVarCharColumn({ name: 'industry', isNullable: false }),
      MigrationUtil.getVarCharColumn({ name: 'type', isNullable: false }),
    ],
    foreignKeys: [
      MigrationUtil.createForeignKey(
        ETable.CAMPAIGN_COMPANIES,
        ETable.CAMPAIGN_URLS,
        'url_id'
      ),
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      CreateCampaignCompaniesTable1569932793381.table
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(
      CreateCampaignCompaniesTable1569932793381.table
    );
  }
}
