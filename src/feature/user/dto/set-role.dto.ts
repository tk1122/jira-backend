import {ApiModelProperty} from "@nestjs/swagger";
import {IsArray, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class SetRoleBody {
    @ApiModelProperty()
    @IsNumber({}, {each: true})
    roleIds: number[]
}
