import {ApiModelProperty} from "@nestjs/swagger";
import {IsISO8601, IsOptional, IsString} from "class-validator";

export class UpdateEpicBody {
    @ApiModelProperty()
    @IsString()
    @IsOptional()
    name?: string

    @ApiModelProperty()
    @IsString()
    @IsOptional()
    description?: string

    @ApiModelProperty()
    @IsISO8601()
    @IsOptional()
    startDate?: Date

    @ApiModelProperty()
    @IsISO8601()
    @IsOptional()
    endDate?: Date
}
