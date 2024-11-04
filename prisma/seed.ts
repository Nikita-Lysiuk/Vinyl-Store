import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Vinyl } from '@prisma/client';
import axios from 'axios';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/database/prisma.service';


async function down(prisma: PrismaService) {
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
    await prisma.$executeRaw`TRUNCATE TABLE Vinyl`;
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
}

async function up(app: INestApplication, prisma: PrismaService) {
    const configService = app.get(ConfigService);
    const DISCOGS_TOKEN = configService.get('DISCOGS_TOKEN');
    const SELLER_USERNAME = configService.get('SELLER_USERNAME');
    const DISCOGS_API_URL = configService.get('DISCOGS_API_URL');

    const vinyls = await axios.get(
        `${DISCOGS_API_URL}/users/${SELLER_USERNAME}/inventory`,
        {
            headers: {
                Authorization: `Discogs token=${DISCOGS_TOKEN}`,
            },
            params: {
                status: 'For Sale',
                per_page: 50,
                page: 1,
            },
        }
    );

    const vinylRecords: Vinyl[] = vinyls.data.listings.map((listing: any) => ({
        id: listing.release.id,
        name: listing.release.title,
        authorName: listing.release.artist,
        description: listing.release.description,
        price: listing.price.value,
        image: listing.release.images[0].uri,
    }));

    await prisma.vinyl.createMany({
        data: vinylRecords,
    });

    await app.close();
}

async function main() {
    const app = await NestFactory.create(AppModule);
    const prisma = app.get(PrismaService);

    try {
        await down(prisma);
        await up(app, prisma);
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();