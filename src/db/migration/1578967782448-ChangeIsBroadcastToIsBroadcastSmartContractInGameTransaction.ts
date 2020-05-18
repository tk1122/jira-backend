import {MigrationInterface, QueryRunner, TableIndex} from 'typeorm';

export class ChangeIsBroadcastToIsBroadcastSmartContractInGameTransaction1578967782448
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex(
            'game_transaction',
            'idx_game_transaction_is_broadcast',
        );

        await queryRunner.renameColumn(
            'game_transaction',
            'is_broadcast',
            'is_broadcast_smart_contract',
        );

        await queryRunner.createIndex(
            'game_transaction',
            new TableIndex({
                name: 'idx_game_transaction_is_broadcast_smart_contract',
                columnNames: ['is_broadcast_smart_contract'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex(
            'game_transaction',
            'idx_game_transaction_is_broadcast_smart_contract',
        );

        await queryRunner.renameColumn(
            'game_transaction',
            'is_broadcast_smart_contract',
            'is_broadcast',
        );

        await queryRunner.createIndex(
            'game_transaction',
            new TableIndex({
                name: 'idx_game_transaction_is_broadcast',
                columnNames: ['is_broadcast'],
            }),
        );
    }
}
