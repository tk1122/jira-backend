import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';
import {PagingQuery} from "../../../shared/interface/paging.query";
import {IsOptional, IsString} from "class-validator";

export class GetUserQuery extends PagingQuery {
    @ApiModelPropertyOptional()
    @IsString()
    @IsOptional()
    username: string
}
