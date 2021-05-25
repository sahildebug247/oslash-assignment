import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateCampaignOutreachsTable1569932793384
  implements MigrationInterface {
  private static readonly table = new Table({
    name: ETable.CAMPAIGN_OUTREACHES,
    columns: [
      ...MigrationUtil.getIDAndDatesColumns(),
      ...MigrationUtil.getFKColumns([
        'campaign_id',
        'profile_id',
        'follow_up_id',
      ]),
      MigrationUtil.getTextColumn({ name: 'content' }),
    ],
    foreignKeys: [
      MigrationUtil.createForeignKey(
        ETable.CAMPAIGN_OUTREACHES,
        ETable.CAMPAIGNS,
        'campaign_id'
      ),
      MigrationUtil.createForeignKey(
        ETable.CAMPAIGN_OUTREACHES,
        ETable.CAMPAIGN_PROFILES,
        'profile_id'
      ),
      MigrationUtil.createForeignKey(
        ETable.CAMPAIGN_OUTREACHES,
        ETable.CAMPAIGN_FOLLOWUPS,
        'follow_up_id'
      ),
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      CreateCampaignOutreachsTable1569932793384.table
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(
      CreateCampaignOutreachsTable1569932793384.table
    );
  }
}
