import { ApiModelProperty, ApiResponseModelProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class DefaultEntity {
  @ApiResponseModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseModelProperty()
  @CreateDateColumn({ select: false, name: 'created_at' })
  createdAt: Date;

  @ApiResponseModelProperty()
  @UpdateDateColumn({ select: false, name: 'updated_at' })
  updatedAt: Date;
}
