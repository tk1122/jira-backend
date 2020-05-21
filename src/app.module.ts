import { Module } from '@nestjs/common';
import { ConfigModule } from './shared/module/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './shared/module/config/config.service';
import { UserModule } from './feature/user/user.module';
import { UserEntity } from './feature/user/entity/user.entity';
import { AuthModule } from './feature/auth/auth.module';
import { RoleEntity } from './feature/user/entity/role.entity';
import { PermissionEntity } from './feature/user/entity/permission.entity';
import { ProjectEntity } from './feature/project/entity/project.entity';
import { ProjectModule } from './feature/project/project.module';
import { EpicEntity } from './feature/epic/entity/epic.entity';
import { EpicModule } from './feature/epic/epic.module';
import { SprintModule } from './feature/sprint/sprint.module';
import { SprintEntity } from './feature/sprint/entity/sprint.entity';
import { IssueEntity } from './feature/issue/entity/issue.entity';
import { LabelEntity } from './feature/issue/entity/label.entity';
import { IssueModule } from './feature/issue/issue.module';

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
        entities: [UserEntity, RoleEntity, PermissionEntity, ProjectEntity, EpicEntity, SprintEntity, IssueEntity, LabelEntity],
        synchronize: true,
        // logging: configService.get('SQL_LOG'),
        logging: true,
        // logging: true,
        migrations: [`${__dirname}/migration/**/*{.ts,.js}`],
        cli: {
          migrationsDir: 'src/migration',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    SprintModule,
    EpicModule,
    IssueModule,
  ],
})
export class AppModule {}
