import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../shared/module/config/config.module';
import { ConfigService } from '../../shared/module/config/config.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RoleGuard } from './guard/role.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { PermissionEntity } from '../user/entity/permission.entity';
import { RoleEntity } from '../user/entity/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PermissionEntity, RoleEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES'),
        },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, RoleGuard, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
