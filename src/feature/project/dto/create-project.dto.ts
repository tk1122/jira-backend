import {IsNumber, IsString} from "class-validator";
import {ApiModelProperty} from "@nestjs/swagger";

export class CreateProjectBody {
    @ApiModelProperty()
    @IsString()
    name: string

    @ApiModelProperty()
    @IsString()
    description: string

    @ApiModelProperty()
    @IsNumber()
    leaderId: number
}
