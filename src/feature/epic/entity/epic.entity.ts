import {Column, Entity, ManyToOne} from "typeorm";
import {DefaultEntity} from "../../../shared/interface/default.entity";
import {ProjectEntity} from "../../project/entity/project.entity";

@Entity('epic')
export class EpicEntity extends DefaultEntity {
    @Column()
    name: string

    @Column()
    description: string

    @Column({type: "timestamp", name: 'start_date'})
    startDate: Date

    @Column({type: "timestamp", name: 'end_date'})
    endDate: Date

    @Column({name: 'entity_type', type: "tinyint"})
    entityType: EpicEntityType

    @ManyToOne(() => ProjectEntity, p => p.epics)
    project: ProjectEntity

    constructor(name: string, description: string, startDate: Date, endDate: Date, project: ProjectEntity) {
        super();
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.project = project;
        this.entityType = 1;
    }
}

export type EpicEntityType = 1;
