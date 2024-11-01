import { Module } from '@nestjs/common';
import { FilesService } from 'src/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MapperService } from 'src/common/mapper.service';

@Module({
    controllers: [PostsController],
    providers: [FilesService, PostsService, MapperService],
})
export class PostsModule {}
