import {IsInt, Min} from 'class-validator';
import {Transform} from 'class-transformer';
import {ApiModelProperty} from '@nestjs/swagger';

export class PagingQuery {
    @ApiModelProperty({required: false})
    @IsInt()
    @Min(1)
    @Transform(value => Number(value))
    page: number = 1;

    @ApiModelProperty({required: false})
    @IsInt()
    @Min(1)
    @Transform(value => Number(value))
    limit: number = 10;
}
