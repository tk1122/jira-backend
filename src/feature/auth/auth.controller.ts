import {Body, Controller, Logger, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto} from './dto/login.dto';
import {Public} from '../../shared/decorator/public.decorator';
import {ApiOkResponse, ApiUseTags} from '@nestjs/swagger';
import {AccessTokenDto} from './dto/access-token.dto';
import {RegisterBody} from "./dto/register.dto";
import {UserService} from "../user/user.service";

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService, private readonly userService: UserService) {
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

    @Post('register')
    @Public()
    async signup(@Body() registerBody: RegisterBody) {
        return this.userService.create(registerBody.username, registerBody.password, {
            age: registerBody.age,
            email: registerBody.email,
            gender: registerBody.gender,
            fullname: registerBody.fullname
        });
    }
}
