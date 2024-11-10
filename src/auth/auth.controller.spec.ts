import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prisma.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, ConfigModule],
            controllers: [AuthController],
            providers: [AuthService],
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
    });

    describe('POST /auth/register', () => {
        it('should register a new user with a valid data is provided', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'example@example.test',
                    password: 'password',
                    birthDate: '1990-01-01',
                });

            expect(response.status).toBe(201);
            expect(response.text).toEqual('User registered successfully');
        });

        it('should return 400 if email already exists', async () => {
            await prisma.user.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'example@example.test',
                    password: 'password',
                    birthDate: '1990-01-01',
                },
            });

            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'example@example.test',
                    password: 'password',
                    birthDate: '1990-01-01',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Email already exists');
        });
    });

    describe('POST /auth/login', () => {
        it('should login a user when a valid data is provided', async () => {
            await request(app.getHttpServer()).post('/auth/register').send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'example@example.test',
                password: 'password',
                birthDate: '1990-01-01',
            });

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'example@example.test',
                    password: 'password',
                });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('should return 404 if user not found', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'example@example.test',
                    password: 'password',
                });

            expect(response.status).toBe(404);
            expect(response.body.error).toEqual('User not found');
        });
    });
});
