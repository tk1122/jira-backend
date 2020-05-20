import {Module} from "@nestjs/common";
import {EpicController} from "./epic.controller";
import {EpicService} from "./epic.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EpicEntity} from "./entity/epic.entity";
import {ProjectEntity} from "../project/entity/project.entity";

@Module({
    imports: [TypeOrmModule.forFeature([EpicEntity, ProjectEntity])],
    controllers: [EpicController],
    providers: [EpicService]
})
export class EpicModule {
    
}
