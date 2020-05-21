import { DefaultEntity } from '../../../shared/interface/default.entity';
import { Column } from 'typeorm';

export class LabelEntity extends DefaultEntity {
  @Column({ unique: true })
  name: string;

  constructor(name: string) {
    super();

    this.name = name;
  }
}
