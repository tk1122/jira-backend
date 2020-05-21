import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddIsPendingToSmartContractToGameTransaction1578967515003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'game_transaction',
      new TableColumn({
        name: 'is_pending_smart_contract',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );

    await queryRunner.createIndex(
      'game_transaction',
      new TableIndex({
        name: 'idx_game_transaction_is_pending_smart_contract',
        columnNames: ['is_pending_smart_contract'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex('game_transaction', 'idx_game_transaction_is_pending_smart_contract');
    await queryRunner.dropColumn('game_transaction', 'is_pending_smart_contract');
  }
}
