import { Module } from '@nestjs/common';
import { FilesService } from 'src/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
    controllers: [PostsController],
    providers: [FilesService, PostsService],
})
export class PostsModule {}
