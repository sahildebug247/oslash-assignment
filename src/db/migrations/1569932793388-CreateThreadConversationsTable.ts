import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../util/migration.util';
import ETable from '../../app/enum/table.enum';

export class CreateThreadConversationsTable1569932793388
  implements MigrationInterface {
  private static readonly table = new Table({
    name: ETable.THREAD_CONVERSATIONS,
    columns: [
      ...MigrationUtil.getIDAndDatesColumns(),
      ...MigrationUtil.getFKColumns(['thread_id']),
      MigrationUtil.getFloat8Column({ name: 'plain_id' }),
      MigrationUtil.getVarCharColumn({ name: 'public_identifier' }),
      MigrationUtil.getTextColumn({ name: 'text' }),
      MigrationUtil.getFloat8Column({ name: 'timestamp' }),
      MigrationUtil.getVarCharColumn({ name: 'name' }),
    ],
    foreignKeys: [
      MigrationUtil.createForeignKey(
        ETable.THREAD_CONVERSATIONS,
        ETable.CAMPAIGN_THREAD,
        'thread_id'
      ),
    ],
    indices: [
      {
        name: 'thread_id_index',
        columnNames: ['thread_id'],
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      CreateThreadConversationsTable1569932793388.table
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(
      CreateThreadConversationsTable1569932793388.table
    );
  }
}
