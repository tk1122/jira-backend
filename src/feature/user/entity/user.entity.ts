import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { DefaultEntity } from '../../../shared/interface/default.entity';
import { RoleEntity } from './role.entity';
import { ProjectEntity } from '../../project/entity/project.entity';
import { IssueEntity } from '../../issue/entity/issue.entity';

@Entity('user')
export class UserEntity extends DefaultEntity {
  @ApiModelProperty()
  @Column()
  username: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  fullname?: string;

  @ApiModelProperty()
  @Column({
    type: 'tinyint',
  })
  status: UserStatus;

  @ApiModelProperty()
  @Column({
    select: false,
  })
  password: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  email?: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  skill?: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  level?: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  age?: number;

  @ApiModelProperty()
  @Column({ type: 'tinyint', nullable: true })
  gender?: UserGender;

  @ApiModelProperty()
  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'user_role', joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'role_id' } })
  roles: RoleEntity[];

  @OneToMany(
    () => ProjectEntity,
    p => p.pm,
  )
  manageProjects: ProjectEntity[];

  @OneToMany(
    () => ProjectEntity,
    p => p.leader,
  )
  leadProjects: ProjectEntity[];

  @OneToMany(
    () => IssueEntity,
    i => i.assignee,
  )
  assignedIssues: IssueEntity[];

  @OneToMany(
    () => IssueEntity,
    i => i.reporter,
  )
  reportedIssues: IssueEntity[];
}

export enum UserStatus {
  Unactivated,
  Activated,
  Blocked,
}

export enum UserGender {
  Male,
  Female,
  Others,
}
