import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateTables1577264486630 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'block',
                columns: [
                    {
                        isPrimary: true,
                        name: 'id',
                        type: 'int',
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'height',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                engine: 'InnoDB',
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'game',
                columns: [
                    {
                        isPrimary: true,
                        name: 'id',
                        type: 'int',
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'english_title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'chinese_simplified',
                        type: 'varchar',
                        isNullable: false,
                        charset: 'utf8mb4',
                        collation: 'utf8mb4_unicode_ci',
                    },
                    {
                        name: 'chinese_traditional',
                        type: 'varchar',
                        isNullable: false,
                        charset: 'utf8mb4',
                        collation: 'utf8mb4_unicode_ci',
                    },
                    {
                        name: 'game_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'logo',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                engine: 'InnoDB',
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'wallet',
                columns: [
                    {
                        isPrimary: true,
                        name: 'id',
                        type: 'int',
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'address',
                        type: 'varchar',
                        length: '40',
                        isNullable: false,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '64',
                        isNullable: true,
                    },
                    {
                        name: 'password_encrypt_key',
                        type: 'varchar',
                        length: '64',
                        isNullable: true,
                    },
                    {
                        name: 'encrypted_private_key',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'mnemonic',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'balance',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'data_signed',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                engine: 'InnoDB',
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'transaction',
                columns: [
                    {
                        isPrimary: true,
                        name: 'id',
                        type: 'int',
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'hash',
                        type: 'varchar',
                        length: '64',
                        isNullable: false,
                    },
                    {
                        name: 'from',
                        type: 'varchar',
                        length: '40',
                        isNullable: false,
                    },
                    {
                        name: 'to',
                        type: 'varchar',
                        length: '40',
                        isNullable: false,
                    },
                    {
                        name: 'amount',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: false,
                    },
                    {
                        name: 'is_pending',
                        type: 'tinyint',
                        isNullable: false,
                    },
                    {
                        name: 'block',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'timestamp',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'sender_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'receiver_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                engine: 'InnoDB',
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'request_withdraw',
                columns: [
                    {
                        isPrimary: true,
                        name: 'id',
                        type: 'int',
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'hash',
                        type: 'varchar',
                        length: '64',
                        isNullable: false,
                    },
                    {
                        name: 'sender',
                        type: 'varchar',
                        length: '40',
                        isNullable: true,
                    },
                    {
                        name: 'receiver',
                        type: 'varchar',
                        length: '40',
                        isNullable: false,
                    },
                    {
                        name: 'amount',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: false,
                    },
                    {
                        name: 'type',
                        type: 'tinyint',
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '1',
                        isNullable: false,
                        default: '0',
                    },
                    {
                        name: 'timestamp',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'sender_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'receiver_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                engine: 'InnoDB',
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        isPrimary: true,
                        name: 'id',
                        type: 'int',
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '64',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'alias',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'is_admin',
                        type: 'tinyint',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'wallet_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                engine: 'InnoDB',
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'game_transaction',
                columns: [
                    {
                        isPrimary: true,
                        name: 'id',
                        type: 'int',
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'game_transaction_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'amount',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: false,
                    },
                    {
                        name: 'action',
                        type: 'tinyint',
                        isNullable: false,
                    },
                    {
                        name: 'currency',
                        type: 'varchar',
                        length: '10',
                        isNullable: false,
                    },
                    {
                        name: 'game_round',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'round_end',
                        type: 'tinyint',
                        isNullable: false,
                    },
                    {
                        name: 'is_rollback',
                        type: 'tinyint',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'game_session_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                engine: 'InnoDB',
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'game_session',
                columns: [
                    {
                        isPrimary: true,
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isNullable: false,
                    },
                    {
                        name: 'expired_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'is_validated',
                        type: 'tinyint',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'game_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'player_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                engine: 'InnoDB',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('block');
        await queryRunner.dropTable('game');
        await queryRunner.dropTable('wallet');
        await queryRunner.dropTable('transaction');
        await queryRunner.dropTable('request_withdraw');
        await queryRunner.dropTable('user');
        await queryRunner.dropTable('game_transaction');
        await queryRunner.dropTable('game_session');
    }
}
