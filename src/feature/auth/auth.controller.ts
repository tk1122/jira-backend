import {Body, Controller, Get, Logger, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto} from './dto/login-dto';
import {Public} from '../../shared/decorator/public.decorator';
import {ApiOkResponse, ApiUseTags} from '@nestjs/swagger';
import {AccessTokenDto} from './dto/access-token.dto';
import {Scopes} from "../../shared/decorator/scopes.decorator";
import {PermissionScopes} from "../user/entity/permission.entity";

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    @Public()
    @ApiOkResponse({type: AccessTokenDto})
    async login(@Body() loginData: LoginDto) {
        const accessToken = await this.authService.createSession(
            loginData.username,
            loginData.password,
        );
        return {accessToken};
    }

    @Get('test')
    @Scopes(PermissionScopes.ReadSprint, PermissionScopes.ReadEpic)
    async test() {
        return {};
    }
}
