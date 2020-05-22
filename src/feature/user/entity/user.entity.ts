import { Column, Entity, JoinTable, ManyToMany, OneToMany, RelationId } from 'typeorm';
import { ApiModelProperty, ApiResponseModelProperty } from '@nestjs/swagger';
import { DefaultEntity } from '../../../shared/interface/default.entity';
import { RoleEntity } from './role.entity';
import { ProjectEntity } from '../../project/entity/project.entity';
import { IssueEntity } from '../../issue/entity/issue.entity';

@Entity('user')
export class UserEntity extends DefaultEntity {
  @ApiResponseModelProperty()
  @Column()
  username: string;

  @ApiResponseModelProperty()
  @Column({ nullable: true })
  fullname?: string;

  @ApiResponseModelProperty()
  @Column({
    type: 'tinyint',
  })
  status: UserStatus;

  @ApiResponseModelProperty()
  @Column({
    select: false,
  })
  password: string;

  @ApiResponseModelProperty()
  @Column({ nullable: true })
  email?: string;

  @ApiResponseModelProperty()
  @Column({ nullable: true })
  skill?: string;

  @ApiResponseModelProperty()
  @Column({ nullable: true })
  level?: string;

  @ApiResponseModelProperty()
  @Column({ nullable: true })
  age?: number;

  @ApiResponseModelProperty()
  @Column({ type: 'tinyint', nullable: true })
  gender?: UserGender;

  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'user_role', joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'role_id' } })
  roles: RoleEntity[];

  @ApiResponseModelProperty()
  @RelationId((user: UserEntity) => user.roles)
  roleIds: number[];

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
