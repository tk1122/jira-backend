import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddIsBroadcastToGameTransaction1578559438055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'game_transaction',
      new TableColumn({
        name: 'is_broadcast',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );

    await queryRunner.createIndex(
      'game_transaction',
      new TableIndex({
        name: 'idx_game_transaction_is_broadcast',
        columnNames: ['is_broadcast'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex('game_transaction', 'idx_game_transaction_is_broadcast');
    await queryRunner.dropColumn('game_transaction', 'is_broadcast');
  }
}
