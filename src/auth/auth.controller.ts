import { Body, Controller, Get, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { Public } from 'src/decorators';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
    public constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    @Public()
    async register(@Body() registerDto: RegisterDto): Promise<string> {
        return await this.authService.register(registerDto);
    }

    @Post('login')
    @Public()
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return await this.authService.login(loginDto);
       
    }

    @Post('logout')
    async logout(@Req() req): Promise<string> {
        const token: string = req.token;
        return await this.authService.logout(token);
    }

    @Get('google')
    @Public()
    @UseGuards(AuthGuard('google'))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async googleAuth(@Req() req) {
        
    }

    @Get('google/callback')
    @Public()
    @UseGuards(AuthGuard('google')) 
    async googleAuthRedirect(@Req() req): Promise<{ token: string }> {
        const user = req.user;
        return await this.authService.generateJwtToken(user);
    }
}