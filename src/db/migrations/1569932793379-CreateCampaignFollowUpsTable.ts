import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCampaignFollowUpsTable1569932793379
  implements MigrationInterface {
  private static readonly table = new Table({
    name: ETable.CAMPAIGN_FOLLOWUPS,
    columns: [
      ...MigrationUtil.getIDAndDatesColumns(),
      ...MigrationUtil.getFKColumns([
        'created_by',
        'last_updated_by',
        'campaign_id',
      ]),
      MigrationUtil.getVarCharColumn({ name: 'name', isNullable: false }),
      MigrationUtil.getTextColumn({ name: 'content', isNullable: false }),
      MigrationUtil.getSmallINTColumn({ name: 'priority', isNullable: false }),
    ],
    foreignKeys: [
      MigrationUtil.createForeignKey(
        ETable.CAMPAIGN_FOLLOWUPS,
        ETable.USERS,
        'created_by'
      ),
      MigrationUtil.createForeignKey(
        ETable.CAMPAIGN_FOLLOWUPS,
        ETable.USERS,
        'last_updated_by'
      ),
      MigrationUtil.createForeignKey(
        ETable.CAMPAIGN_FOLLOWUPS,
        ETable.CAMPAIGNS,
        'campaign_id'
      ),
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      CreateCampaignFollowUpsTable1569932793379.table
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(
      CreateCampaignFollowUpsTable1569932793379.table
    );
  }
}
