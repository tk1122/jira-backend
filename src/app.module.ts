import {Module} from '@nestjs/common';
import {ConfigModule} from './shared/module/config/config.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigService} from './shared/module/config/config.service';
import {UserModule} from './feature/user/user.module';
import {UserEntity} from './feature/user/entity/user.entity';
import {AuthModule} from './feature/auth/auth.module';
import {RoleEntity} from "./feature/user/entity/role.entity";
import {PermissionEntity} from "./feature/user/entity/permission.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            // @ts-ignore
            useFactory: async (configService: ConfigService) => ({
                type: configService.get('DB_TYPE'),
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [
                    UserEntity,
                    RoleEntity,
                    PermissionEntity
                ],
                synchronize: true,
                logging: configService.get('SQL_LOG'),
                migrations: [`${__dirname}/migration/**/*{.ts,.js}`],
                cli: {
                    migrationsDir: 'src/migration',
                },
            }),
            inject: [ConfigService],
        }),
        UserModule,
        AuthModule,
    ],
})
export class AppModule {
}
