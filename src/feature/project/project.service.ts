import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity, ProjectStatus } from './entity/project.entity';
import { Brackets, Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { RoleEntity, Roles } from '../user/entity/role.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private readonly roleRepo: Repository<RoleEntity>,
  ) {}

  async createProject(name: string, description: string, pmId: number, leaderId: number) {
    const leader = await this.userRepo
      .createQueryBuilder('u')
      .select(['u.id'])
      .innerJoin('u.roles', 'r')
      .where('u.id = :leaderId', { leaderId })
      .where('r.name = :leaderRole', { leaderRole: Roles.Leader })
      .getOne();

    if (!leader) {
      throw new BadRequestException('Leader not found');
    }

    return this.projectRepo.save(new ProjectEntity(name, description, { id: pmId } as UserEntity, leader));
  }

  async updateProject(projectId: number, memberIds: number[], name: string, description: string, status: ProjectStatus) {
    const project = await this.projectRepo.findOne({ id: projectId });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const members = await this.userRepo
      .createQueryBuilder('u')
      .select(['u.id'])
      .where('u.id IN (:...memberIds)', { memberIds })
      .getMany();

    project.name = name;
    project.description = description;
    project.status = status;
    project.members = members;

    return this.projectRepo.save(project);
  }

  async getProjects(userId: number, name = '', status?: ProjectStatus, page = 1, limit = 10) {
    const getProjectsQuery = this.projectRepo
      .createQueryBuilder('p')
      .select(['p', 'l.id', 'pm.id'])
      .where('p.name LIKE :name', { name: `${name}%` })
      // .innerJoin('p.members', 'm')
      .innerJoin('p.leader', 'l')
      .innerJoin('p.pm', 'pm');

    if (status !== undefined) {
      getProjectsQuery.andWhere('p.status = :status', { status });
    }

    getProjectsQuery.andWhere(
      new Brackets(qb => {
        return qb
          .andWhere('l.id = :userId', { userId })
          .orWhere('pm.id = :userId', { userId })
          .orWhere('m.id = :userId', { userId });
      }),
    );

    getProjectsQuery.skip((page - 1) * limit).take(limit);

    return getProjectsQuery.getMany();
  }
}
