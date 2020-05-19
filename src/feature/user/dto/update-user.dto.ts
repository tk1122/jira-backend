import {ApiModelProperty} from "@nestjs/swagger";
import {IsEnum, IsString} from "class-validator";
import {UserStatus} from "../entity/user.entity";

export class UpdateUserBody {
    @ApiModelProperty()
    @IsString()
    skill: string

    @ApiModelProperty()
    @IsString()
    level: string

    @ApiModelProperty()
    @IsEnum(UserStatus)
    status: UserStatus
}
