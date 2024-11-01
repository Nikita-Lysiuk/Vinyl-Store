import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { GetProfileData, User } from './interfaces/users.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FilesService, MailService } from 'src/common';
import { LoginUserDto, RegisterUserDto, UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
    private users: User[] = [];
    private readonly USER_PATH: string;

    constructor(
        private readonly filesService: FilesService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService
    ) {
        this.USER_PATH = this.configService.get<string>('USER_DATA_PATH') || '';
    }

    async register(registerUserDto: RegisterUserDto): Promise<string> {
        const { email, password, firstName, lastName } = registerUserDto;

        try {
            this.users = await this.filesService.readDataFromFile<User>(
                this.USER_PATH
            );
            const user = this.users.find((user: User) => user.email === email);
            if (user) {
                throw new HttpException(
                    'User with this email already exists',
                    HttpStatus.BAD_REQUEST
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser: User = {
                id: uuidv4(),
                email,
                password: hashedPassword,
                firstName,
                lastName,
            };
            this.users.push(newUser);

            await this.filesService.writeDataToFile<User>(
                this.USER_PATH,
                this.users
            );
            return 'User registered successfully';
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(loginData: LoginUserDto): Promise<{ token: string }> {
        const { email, password } = loginData;

        try {
            this.users = await this.filesService.readDataFromFile<User>(
                this.USER_PATH
            );
            const user = this.users.find((user: User) => user.email === email);
            if (user && (await bcrypt.compare(password, user.password))) {
                const payload = { userId: user.id };
                const token = await this.jwtService.signAsync(payload);
                return { token };
            } else {
                throw new HttpException(
                    'Invalid email or password',
                    HttpStatus.UNAUTHORIZED
                );
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProfile(userId: string): Promise<GetProfileData> {
        try {
            this.users = await this.filesService.readDataFromFile<User>(
                this.USER_PATH
            );

            const user = this.users.find((user: User) => user.id === userId);
            const profileData: GetProfileData = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            };

            return profileData;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProfile(
        userId: string,
        profileData: UpdateProfileDto
    ): Promise<string> {
        try {
            this.users = await this.filesService.readDataFromFile<User>(
                this.USER_PATH
            );
            const userIndex = this.users.findIndex(
                (user: User) => user.id === userId
            );
            if (userIndex === -1) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const { firstName, lastName } = profileData;
            this.users[userIndex].firstName = firstName;
            this.users[userIndex].lastName = lastName;

            await this.filesService.writeDataToFile<User>(
                this.USER_PATH,
                this.users
            );
            await this.mailService.sendMail(this.users[userIndex].email);
            return 'Profile updated successfully';
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
