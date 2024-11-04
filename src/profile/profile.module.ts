import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { S3Service } from 'src/common';

@Module({
    providers: [
        PrismaService,
        ProfileService,
        S3Service,
    ],
    controllers: [ProfileController],
}) 
export class ProfileModule {}