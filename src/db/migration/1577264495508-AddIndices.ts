import {MigrationInterface, QueryRunner, TableIndex} from 'typeorm';

export class AddIndices1577264495508 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createIndices('block', [
            new TableIndex({
                name: 'idx_block_height',
                columnNames: ['height'],
            }),
        ]);

        await queryRunner.createIndices('game', [
            new TableIndex({
                name: 'unique_idx_game_game_id',
                columnNames: ['game_id'],
                isUnique: true,
            }),
        ]);

        await queryRunner.createIndices('wallet', [
            new TableIndex({
                name: 'unique_idx_wallet_address',
                columnNames: ['address'],
                isUnique: true,
            }),
        ]);

        await queryRunner.createIndices('transaction', [
            new TableIndex({
                name: 'unique_idx_transaction_hash',
                columnNames: ['hash'],
                isUnique: true,
            }),
        ]);

        await queryRunner.createIndices('user', [
            new TableIndex({
                name: 'unique_idx_user_wallet_id',
                columnNames: ['wallet_id'],
                isUnique: true,
            }),
            new TableIndex({
                name: 'unique_idx_user_email',
                columnNames: ['email'],
                isUnique: true,
            }),
        ]);

        await queryRunner.createIndices('game_transaction', [
            new TableIndex({
                name: 'unique_idx_game_transaction_game_transaction_id_game_round',
                columnNames: ['game_transaction_id', 'game_round'],
                isUnique: true,
            }),
            new TableIndex({
                name: 'idx_game_transaction_round_end',
                columnNames: ['round_end'],
            }),
            new TableIndex({
                name: 'idx_game_transaction_is_rollback',
                columnNames: ['is_rollback'],
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex('block', 'idx_block_height');
        await queryRunner.dropIndex('game', 'unique_idx_game_game_id');
        await queryRunner.dropIndex('wallet', 'unique_idx_wallet_address');
        await queryRunner.dropIndex('transaction', 'unique_idx_transaction_hash');
        await queryRunner.dropIndex('user', 'unique_idx_user_wallet_id');
        await queryRunner.dropIndex('user', 'unique_idx_user_email');
        await queryRunner.dropIndex(
            'game_transaction',
            'unique_idx_game_transaction_game_transaction_id_game_round',
        );
        await queryRunner.dropIndex(
            'game_transaction',
            'idx_game_transaction_round_end',
        );
        await queryRunner.dropIndex(
            'game_transaction',
            'idx_game_transaction_is_rollback',
        );
        await queryRunner.dropIndex(
            'game_transaction',
            'fk_game_transaction_game_session_id',
        );
    }
}
