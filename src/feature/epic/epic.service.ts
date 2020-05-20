import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {EpicEntity} from "./entity/epic.entity";
import {Repository} from "typeorm";
import {ProjectEntity} from "../project/entity/project.entity";

@Injectable()
export class EpicService {
    constructor(
        @InjectRepository(EpicEntity) private readonly epicRepo: Repository<EpicEntity>,
        @InjectRepository(ProjectEntity) private readonly projectRepo: Repository<ProjectEntity>
    ) {
    }

    async createEpic(projectId: number, userId: number, name: string, description: string, startDate: Date, endDate: Date) {
        const project = await this.projectRepo.createQueryBuilder('p')
            .select(['p.id', 'pm.id'])
            .leftJoin('p.pm', 'pm')
            .where('p.id = :projectId', {projectId})
            .getOne()

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (project?.pm?.id !== userId) {
            throw  new UnauthorizedException('You cannnot create epic for this project')
        }

        const epic = new EpicEntity(name, description, startDate, endDate, project);

        return this.epicRepo.save(epic)
    }

    async updateEpic(epicId: number, userId: number, name?: string, description?: string, startDate?: Date, endDate?: Date) {
        const epic = await this.epicRepo.createQueryBuilder('e')
            .select(['e.id', 'p.id'])
            .leftJoin('e.project', 'p')
            .where('e.id = :epicId', {epicId})
            .getOne();

        if (!epic) {
            throw  new NotFoundException('Epic not found');
        }

        const project = await this.projectRepo.createQueryBuilder('p')
            .select(['p.id', 'pm.id'])
            .innerJoin('p.pm', 'pm')
            .where('p.id = :projectId', {projectId: epic?.project?.id})
            .getOne()

        if (!project) {
            throw new NotFoundException('Epic not belong to any project')
        }

        if (project?.pm?.id !== userId) {
            throw new UnauthorizedException('You cannot update this epic')
        }

        if (name !== undefined) {
            epic.name = name;
        }

        if (description !== undefined) {
            epic.description = description;
        }

        if (startDate !== undefined) {
            epic.startDate = startDate;
        }

        if (endDate !== undefined) {
            epic.endDate = endDate;
        }

        return this.epicRepo.save(epic);
    }

    async getOneEpic(epicId: number, userId: number) {
        const epic = await this.epicRepo.createQueryBuilder('e')
            .select(['e', 'p.id'])
            .leftJoin('e.project', 'p')
            .where('e.id = :epicId', {epicId})
            .getOne();

        if (!epic) {
            throw  new NotFoundException('Epic not found');
        }

        const project = await this.getProjectById(epic?.project?.id)

        if (!project) {
            throw new NotFoundException('Epic not belong to any project')
        }

        if (!this.isMemberOfProject(userId, project)
        ) {
            throw new UnauthorizedException('You cannot get this epic')
        }

        return epic;
    }

    async getManyEpic(projectId: number, userId: number) {
        const project = await this.getProjectById(projectId)

        if (!project) {
            throw new NotFoundException('Project not found')
        }

        if (!this.isMemberOfProject(userId, project)
        ) {
            throw new UnauthorizedException('You cannot get epics of this project')
        }

        return this.epicRepo.find({where: {project}})
    }

    async getProjectById(projectId: number) {
        return this.projectRepo.createQueryBuilder('p')
            .select(['p.id', 'pm.id', 'l.id', 'm.id'])
            .leftJoin('p.pm', 'pm')
            .leftJoin('p.leader', 'l')
            .leftJoin('p.members', 'm')
            .where('p.id = :projectId', {projectId})
            .getOne()
    }

    isMemberOfProject(userId: number, project: ProjectEntity) {
        return !(project?.pm?.id !== userId &&
            project?.leader?.id !== userId &&
            !project?.members.map(m => m?.id).includes(userId));
    }
}
