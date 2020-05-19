import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '../../../shared/module/config/config.service';
import {JWTPayload, UserSession} from '../../../shared/interface/session.interface';
import {UserService} from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: JWTPayload): Promise<UserSession> {
        const user = await this.userService.getOneById(payload.userId);

        if (!user) {
            throw new UnauthorizedException();
        }

        return {
            userId: user.id,
            isAdmin: payload.isAdmin
        };
    }
}
