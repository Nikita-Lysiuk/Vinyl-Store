import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GetProfileData } from './interfaces/users.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common';
import { LoginUserDto, RegisterUserDto, UpdateProfileDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<string> {
        const { email, password, firstName, lastName } = registerUserDto;

        try {
            const user = await this.userRepository.findOne({
                where: { email },
            });

            if (user) {
                throw new HttpException(
                    'User with this email already exists',
                    HttpStatus.BAD_REQUEST
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await this.userRepository.save({
                email,
                password: hashedPassword,
                firstName,
                lastName,
            });

            return 'User registered successfully';
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(loginData: LoginUserDto): Promise<{ token: string }> {
        const { email, password } = loginData;

        try {
            const user = await this.userRepository.findOne({
                where: { email },
            });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new HttpException(
                    'email or password is incorrect',
                    HttpStatus.UNAUTHORIZED
                );
            }

            const token = await this.jwtService.signAsync({ userId: user.id });

            return { token };
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProfile(userId: string): Promise<GetProfileData> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            return {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            };
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProfile(
        userId: string,
        profileData: UpdateProfileDto
    ): Promise<string> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            await this.userRepository.update(userId, profileData);
            await this.mailService.sendMail(user.email);
            return 'Profile updated successfully';
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
