import { ApiResponseModelProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class DefaultEntity {
  @ApiResponseModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseModelProperty()
  @Column({ type: 'timestamp', select: false, name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiResponseModelProperty()
  @Column({ type: 'timestamp', select: false, name: 'updated_at' })
  updatedAt: Date;
}
