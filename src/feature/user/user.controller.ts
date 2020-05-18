import {Controller, Logger} from '@nestjs/common';
import {UserService} from './user.service';
import {ApiUseTags} from '@nestjs/swagger';

// @ts-ignore

@ApiUseTags('users')
@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        private readonly userService: UserService,
    ) {
    }

}
