import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';
import EClientStatus from '../../app/enum/client.enum';

export class CreateClientsTable1569932793376 implements MigrationInterface {
  private static readonly table = new Table({
    name: ETable.CLIENTS,
    columns: [
      ...MigrationUtil.getIDAndDatesColumns(),
      ...MigrationUtil.getFKColumns(['created_by', 'last_updated_by']),
      MigrationUtil.getVarCharColumn({ name: 'name' }),
      MigrationUtil.getVarCharColumn({ name: 'email', isUnique: true }),
      MigrationUtil.getVarCharColumn({
        name: 'status',
        defaultValue: EClientStatus.ACTIVE,
      }),
    ],
    foreignKeys: [
      MigrationUtil.createForeignKey(
        ETable.CLIENTS,
        ETable.USERS,
        'created_by'
      ),
      MigrationUtil.createForeignKey(
        ETable.CLIENTS,
        ETable.USERS,
        'last_updated_by'
      ),
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(CreateClientsTable1569932793376.table);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(CreateClientsTable1569932793376.table);
  }
}
