import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddForeignKeys1577264506559 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createForeignKeys('transaction', [
      new TableForeignKey({
        name: 'fk_transaction_sender_id',
        columnNames: ['sender_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
      new TableForeignKey({
        name: 'fk_transaction_receiver_id',
        columnNames: ['receiver_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    ]);

    await queryRunner.createForeignKeys('user', [
      new TableForeignKey({
        name: 'fk_user_wallet_id',
        columnNames: ['wallet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'wallet',
      }),
    ]);

    await queryRunner.createForeignKeys('game_transaction', [
      new TableForeignKey({
        name: 'fk_game_transaction_game_session_id',
        columnNames: ['game_session_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'game_session',
      }),
    ]);

    await queryRunner.createForeignKeys('game_session', [
      new TableForeignKey({
        name: 'fk_game_session_player_id',
        columnNames: ['player_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
      new TableForeignKey({
        name: 'fk_game_session_game_id',
        columnNames: ['game_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'game',
      }),
    ]);

    await queryRunner.createForeignKeys('request_withdraw', [
      new TableForeignKey({
        name: 'fk_request_withdraw_sender_id',
        columnNames: ['sender_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
      new TableForeignKey({
        name: 'fk_request_withdraw_receiver_id',
        columnNames: ['receiver_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('transaction', 'fk_transaction_sender_id');
    await queryRunner.dropForeignKey('transaction', 'fk_transaction_receiver_id');
    await queryRunner.dropForeignKey('user', 'fk_user_wallet_id');
    await queryRunner.dropForeignKey('game_transaction', 'fk_game_transaction_game_session_id');
    await queryRunner.dropForeignKey('game_session', 'fk_game_session_player_id');
    await queryRunner.dropForeignKey('game_session', 'fk_game_session_game_id');
    await queryRunner.dropForeignKey('request_withdraw', 'fk_request_withdraw_sender_id');
    await queryRunner.dropForeignKey('request_withdraw', 'fk_request_withdraw_receiver_id');
  }
}
