import {Module} from "@nestjs/common";
import {SprintController} from "./sprint.controller";
import {SprintService} from "./sprint.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SprintEntity} from "./entity/sprint.entity";
import {ProjectEntity} from "../project/entity/project.entity";
import {EpicModule} from "../epic/epic.module";

@Module({
    imports: [TypeOrmModule.forFeature([SprintEntity, ProjectEntity]), EpicModule],
    controllers: [SprintController],
    providers: [SprintService],
})
export class SprintModule {

}
