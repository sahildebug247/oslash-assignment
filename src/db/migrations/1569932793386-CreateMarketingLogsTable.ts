import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreatemarketingLogsTable1569932793386
  implements MigrationInterface {
  private static readonly table = new Table({
    name: ETable.MARKETING_LOGS,
    columns: [
      ...MigrationUtil.getIDAndDatesColumns(),
      MigrationUtil.getVarCharColumn({ name: 'ref_id' }),
      MigrationUtil.getVarCharColumn({ name: 'type' }),
      MigrationUtil.getJSONBColumn({ name: 'data' }),
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(CreatemarketingLogsTable1569932793386.table);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(CreatemarketingLogsTable1569932793386.table);
  }
}
