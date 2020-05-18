import {ApiModelProperty} from '@nestjs/swagger';

export class GetUsersDto {
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    email: string;
}

export class GetUsersAndCountDto {
    @ApiModelProperty({type: [GetUsersDto]})
    users: GetUsersDto[];

    @ApiModelProperty()
    total: number;
}
