import {ApiModelProperty} from "@nestjs/swagger";
import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export abstract class DefaultEntity {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number

    @ApiModelProperty()
    @CreateDateColumn({select: false, name: 'created_at'})
    createdAt: Date;

    @ApiModelProperty()
    @UpdateDateColumn({select: false, name: 'updated_at'})
    updatedAt: Date;
}
