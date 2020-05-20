import {ApiModelProperty} from "@nestjs/swagger";
import {IsISO8601, IsNumber, IsString} from "class-validator";

export class CreateEpicBody {
    @ApiModelProperty()
    @IsString()
    name: string

    @ApiModelProperty()
    @IsString()
    description: string

    @ApiModelProperty()
    @IsISO8601()
    startDate: Date

    @ApiModelProperty()
    @IsISO8601()
    endDate: Date

    @ApiModelProperty()
    @IsNumber()
    projectId: number
}
