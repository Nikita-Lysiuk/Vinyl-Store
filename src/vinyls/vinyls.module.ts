import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { VinylsController } from './vinyls.controller';
import { VinylsService } from './vinyls.service';
import { S3Service } from 'src/common';

@Module({
    providers: [
        PrismaService,
        VinylsService,
        S3Service,
    ],
    controllers: [VinylsController],
})
export class VinylsModule {}