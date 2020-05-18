import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {RoleGuard} from './feature/auth/guard/role.guard';
import {JwtAuthGuard} from './feature/auth/guard/jwt-auth.guard';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as winston from 'winston';
import {utilities as nestWinstonModuleUtilities, WinstonModule} from 'nest-winston';
import {description, version} from '../package.json';
import {LoggingInterceptor} from './shared/interceptor/logging.interceptor';
import {ConfigService} from './shared/module/config/config.service';
import {AuthService} from "./feature/auth/auth.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bodyParser: true,
        cors: true,
    });
    const configService = app.get(ConfigService);

    app.useLogger(
        WinstonModule.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        nestWinstonModuleUtilities.format.nestLike(),
                    ),
                }),
                new winston.transports.File({
                    filename: `logs/Application.log`,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.printf(
                            ({timestamp, level, message, trace, context}) =>
                                `${timestamp};${level};${message}${trace ? `;${trace}` : ''}${
                                    context ? `;${JSON.stringify(context)}` : ''
                                }`,
                        ),
                    ),
                }),
            ],
            level: configService.get('LOG_LEVEL'),
        }),
    );
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.useGlobalGuards(
        new JwtAuthGuard(app.get(Reflector)),
        new RoleGuard(app.get(Reflector), app.get(AuthService)),
    );
    app.useGlobalInterceptors(new LoggingInterceptor());

    const docsOptions = new DocumentBuilder()
        .setTitle(description)
        .setVersion(version)
        .setBasePath('/api')
        .build();

    const document = SwaggerModule.createDocument(app, docsOptions);
    SwaggerModule.setup('api', app, document);

    await app.listen(configService.get('PORT'));
}

bootstrap().then();
