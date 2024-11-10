import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { VinylsController } from './vinyls.controller';
import { VinylsService } from './vinyls.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { PrismaModule } from 'src/database/prisma.module';
import { S3Service } from 'src/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TelegramInterceptor } from 'src/interceptors/telegram.interceptor';

describe('VinylsController', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, ConfigModule],
            controllers: [VinylsController],
            providers: [
                VinylsService,
                {
                    provide: S3Service,
                    useValue: {
                        uploadFile: jest
                            .fn()
                            .mockResolvedValue(
                                'https://mock-s3-url.com/test.jpg'
                            ),
                        deleteFile: jest.fn(),
                    },
                },
                {
                    provide: 'DEFAULT_BOT_NAME',
                    useValue: 'TestBot',
                },
                {
                    provide: TelegramInterceptor,
                    useValue: {
                        intercept: jest
                            .fn()
                            .mockImplementation((context, next) =>
                                next.handle()
                            ),
                        sendTelegramMessage: jest.fn(),
                        sendPhoto: jest.fn(),
                    },
                },
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
        await prisma.user.deleteMany();
        await prisma.vinyl.deleteMany();
        await prisma.review.deleteMany();

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
    });

    describe('GET /vinyls', () => {
        it('should return vinyl list with first review and average score', async () => {
            const response = await request(app.getHttpServer())
                .get('/vinyls')
                .expect(200);

            expect(response.body).toEqual([
                {
                    id: expect.any(Number),
                    name: 'Test Vinyl',
                    authorName: 'Test Author',
                    description: 'Test Description',
                    price: 25.99,
                    averageScore: 5,
                    firstReview: 'Test Comment',
                },
            ]);
        });
    });

    describe('GET /vinyls/search', () => {
        it('should return vinyl list with search query', async () => {
            const response = await request(app.getHttpServer())
                .get('/vinyls/search?name=Test&authorName=Author')
                .expect(200);

            expect(response.body).toEqual([
                {
                    id: expect.any(Number),
                    name: 'Test Vinyl',
                    authorName: 'Test Author',
                    description: 'Test Description',
                    price: 25.99,
                    image: 'https://mock-s3-url.com/test.jpg',
                },
            ]);
        });

        it('should not return vinyl list with name Another', async () => {
            const response = await request(app.getHttpServer())
                .get('/vinyls/search?name=Another')
                .expect(200);

            expect(response.body).toEqual([]);
        });
    });

    describe('GET /vinyls/:id', () => {
        it('should return vinyl by id', async () => {
            const vinyl = await prisma.vinyl.findFirst({
                where: { name: 'Test Vinyl' },
                include: {
                    reviews: true,
                },
            });

            const response = await request(app.getHttpServer())
                .get(`/vinyls/${vinyl.id}`)
                .expect(200);

            response.body.createdAt = new Date(response.body.createdAt);
            response.body.updatedAt = new Date(response.body.updatedAt);
            response.body.reviews.forEach((review) => {
                review.createdAt = new Date(review.createdAt);
                review.updatedAt = new Date(review.updatedAt);
            });

            expect(response.body).toEqual(vinyl);
        });
    });

    // describe('POST', () => {
    //     it('should create vinyl with provided data', async () => {
    //         const response = await request(app.getHttpServer())
    //             .post('/vinyls')
    //             .field('name', 'New Vinyl')
    //             .field('authorName', 'New Author')
    //             .field('description', 'New Description')
    //             .field('price', 19.99)
    //             .attach('coverImage', 'src/assets/imageCover.png')
    //             .expect(201);

    //         expect(response.body).toEqual({
    //             id: expect.any(Number),
    //             name: 'New Vinyl',
    //             authorName: 'New Author',
    //             description: 'New Description',
    //             price: 19.99,
    //             image: 'https://mock-s3-url.com/test.jpg',
    //         });
    //     });

    //     it('should return 400 if cover image is not provided', async () => {
    //         const response = await request(app.getHttpServer())
    //             .post('/vinyls')
    //             .field('name', 'New Vinyl')
    //             .field('authorName', 'New Author')
    //             .field('description', 'New Description')
    //             .field('price', 19.99)
    //             .expect(400);

    //         expect(response.body.message).toEqual('Cover image is required');
    //     });
    // });

    describe('PUT', () => {
        it('should update vinyl by id', async () => {
            const vinyl = await prisma.vinyl.findFirst({
                where: { name: 'Test Vinyl' },
            });

            const response = await request(app.getHttpServer())
                .put(`/vinyls/${vinyl.id}`)
                .send({
                    name: 'Updated Vinyl',
                    authorName: 'Updated Author',
                    description: 'Updated Description',
                    price: 29.99,
                })
                .expect(200);

            delete response.body.createdAt;
            delete response.body.updatedAt;

            expect(response.body).toEqual({
                id: vinyl.id,
                name: 'Updated Vinyl',
                authorName: 'Updated Author',
                description: 'Updated Description',
                price: 29.99,
                image: 'https://mock-s3-url.com/test.jpg',
            });
        });

        it('should not update vinyl by id if data is invalid', async () => {
            const vinyl = await prisma.vinyl.findFirst({
                where: { name: 'Test Vinyl' },
            });

            const response = await request(app.getHttpServer())
                .put(`/vinyls/${vinyl.id}`)
                .send({
                    name: '',
                    authorName: '',
                    description: '',
                    price: 0,
                })
                .expect(400);

            expect(response.body.error.message).toEqual([
                'name must be longer than or equal to 2 characters',
                'authorName must be longer than or equal to 2 characters',
                'description must be longer than or equal to 10 characters',
                'price must not be less than 0.01',
            ]);
        });
    });

    describe('DELETE', () => {
        it('should delete vinyl by id', async () => {
            const vinyl = await prisma.vinyl.findFirst({
                where: { name: 'Test Vinyl' },
            });

            await request(app.getHttpServer())
                .delete(`/vinyls/${vinyl.id}`)
                .expect(200);

            const deletedVinyl = await prisma.vinyl.findUnique({
                where: { id: vinyl.id },
            });

            expect(deletedVinyl).toBeNull();
        });

        it('should not delete vinyl by id if vinyl not found', async () => {
            await request(app.getHttpServer())
                .delete('/vinyls/999')
                .expect(404);
        });
    });
});
