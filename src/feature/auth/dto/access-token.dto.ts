import {ApiModelProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class AccessTokenDto {
    @ApiModelProperty()
    @IsString()
    accessToken: string;
}
