import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';


@Injectable()
export class AuthService {
    private readonly redis: Redis | null;

    public constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
    ) {
        this.redis = this.redisService.getOrThrow();
    }

    async register(registerDto: RegisterDto): Promise<string> {
        try {
            const { email, password, firstName, lastName, birthDate } =
                registerDto;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.prismaService.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    birthDate,
                },
            });

            if (!user) {
                throw new HttpException('User cannot be created', 500);
            }

            return 'User registered successfully';
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new HttpException('Email already exists', 400);
                }
            }
            throw new HttpException('Something went wrong', 500);
        }
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new HttpException('Invalid password', 400);
        }

        return this.generateJwtToken(user);
    } 

    async logout(token: string): Promise<string> {
        const decoded = this.jwtService.decode(token) as { exp: number };
        if (!decoded || !decoded.exp) {
            throw new HttpException('Invalid token', 400);
        }
        const expirationTime = decoded.exp - Math.floor(Date.now() / 1000);
        await this.redis?.set(token, 'token', 'EX', expirationTime);
        return 'Logged out successfully';
    }

    async isBlackListed(token: string): Promise<boolean> {
        const blackListedToken = await this.redis?.get(token);
        return blackListedToken === 'token';
    }

    async  validateOAuthLogin(profile: any): Promise<User> {
        const { name, emails, photos } = profile;

        const user = await this.prismaService.user.findUnique({
            where: { email: emails[0].value },
        });

        if (!user) {
            const newUser = await this.prismaService.user.create({
                data: {
                    firstName: name.givenName,
                    lastName: name.familyName,
                    avatar: photos[0].value,
                    email: emails[0].value, 
                    password: await bcrypt.hash('password', 10),
                    birthDate: new Date(),
                }
            });

            if (!newUser) {
                throw new HttpException('User cannot be created', 500);
            }

            return newUser;
        }

        return user;
    }

    async generateJwtToken(user: User): Promise<{ token: string }> {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = await this.jwtService.signAsync(payload, { expiresIn: '2h' });
        return { token };
    }
}
