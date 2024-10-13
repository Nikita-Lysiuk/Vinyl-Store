import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RegisterUserDto, LoginUserDto, UpdateProfileDto } from './dto';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto): Promise<string> {
        return await this.usersService.register(registerUserDto);
    }

    @Post('login')
    async login(@Body() loginData: LoginUserDto): Promise<{ token: string }> {
        return await this.usersService.login(loginData);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const userId = req.user.userId;
        return await this.usersService.getProfile(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body() profileData: UpdateProfileDto) {
        const userId = req.user.userId;
        return await this.usersService.updateProfile(userId, profileData);
    }
}
