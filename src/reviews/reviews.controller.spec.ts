import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prisma.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import * as request from 'supertest';


describe('ReviewsController', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, ConfigModule],
            controllers: [ReviewsController],
            providers: [
                ReviewsService,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();

        prisma = moduleFixture.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    beforeEach(async () => {
        await prisma.review.deleteMany();
        await prisma.user.deleteMany();
        await prisma.vinyl.deleteMany();

        const user = await prisma.user.create({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@example.com',
                password: 'password',
                birthDate: new Date('1990-01-01'),
                role: 'ADMIN',
            },
        });

        await prisma.vinyl.create({
            data: {
                name: 'Test Vinyl',
                authorName: 'Test Author',
                description: 'Test Description',
                price: 25.99,
                image: 'https://mock-s3-url.com/test.jpg',
                reviews: {
                    create: {
                        comment: 'Test Comment',
                        score: 5,
                        user: { connect: { id: user.id } },
                    },
                },
            },
        });

        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'example@example.test',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe',
                birthDate: '1990-01-01',
            });

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'example@example.test',
                password: 'password',
            });

        token = response.body.token;
    });

    describe('GET /reviews/:id', () => {
        it('should return a list of reviews for a vinyl by its ID', async () => {
            const vinyl = await prisma.vinyl.findFirst({
                where: { name: 'Test Vinyl' },
            });

            const response = await request(app.getHttpServer())
                .get(`/reviews/${vinyl.id}`)
                .expect(200);

            expect(response.body).toHaveLength(1);
            expect(response.body[0].comment).toEqual('Test Comment');
            expect(response.body[0].score).toEqual(5);
        });

        it('should return a 404 error if vinyl is not found', async () => {
            await request(app.getHttpServer())
                .get('/reviews/999')
                .expect(404);
        });
    });

    describe('POST /reviews/:id', () => {
        it('should create a new review for a vinyl by its ID', async () => {
            const vinyl = await prisma.vinyl.findFirst({
                where: { name: 'Test Vinyl' },
            });

            const response = await request(app.getHttpServer())
                .post(`/reviews/${vinyl.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    comment: 'New Comment',
                    score: 4,
                })
                .expect(201);

            expect(response.body.comment).toEqual('New Comment');
            expect(response.body.score).toEqual(4);
        });
    });

    describe('DELETE /reviews/:id', () => {
        it('should delete a review by its ID', async () => {
            const vinyl = await prisma.vinyl.findFirst({
                where: { name: 'Test Vinyl' },
            });

            const review = await prisma.review.findFirst({
                where: { vinylId: vinyl.id },
            });

            await request(app.getHttpServer())
                .delete(`/reviews/${review.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const reviews = await prisma.review.findMany({
                where: { vinylId: vinyl.id },
            });

            expect(reviews).toHaveLength(0);
        });

        it('should return a 404 error if review is not found', async () => {
            await request(app.getHttpServer())
                .delete('/reviews/999')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });
});
