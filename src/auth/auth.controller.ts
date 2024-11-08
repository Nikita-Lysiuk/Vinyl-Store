import { Body, Controller, Get, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { Public } from 'src/decorators';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
    public constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    @Public()
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Register a new user with email and password',
        tags: ['auth', 'post'],
    })
    @ApiResponse({ status: 201, description: 'User has been registered' })
    @ApiBody({ type: RegisterDto })
    async register(@Body() registerDto: RegisterDto): Promise<string> {
        return await this.authService.register(registerDto);
    }

    @Post('login')
    @Public()
    @ApiOperation({
        summary: 'Login a user',
        description: 'Login a user with email and password',
        tags: ['auth', 'post'],
    })
    @ApiResponse({ status: 200, description: 'User has been logged in', type: String })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return await this.authService.login(loginDto);
    }

    @Post('logout')
    @ApiOperation({
        summary: 'Logout a user',
        description: 'Logout the authenticated user',
        tags: ['auth', 'post'],
    })
    @ApiResponse({ status: 200, description: 'User has been logged out' })
    @ApiBearerAuth()
    async logout(@Req() req): Promise<string> {
        const token: string = req.token;
        return await this.authService.logout(token);
    }

    @Get('google')
    @Public()
    @UseGuards(AuthGuard('google'))
    @ApiOperation({
        summary: 'Google OAuth',
        description: 'Authenticate user with Google OAuth',
        tags: ['auth', 'get'],
    })
    @ApiResponse({ status: 200, description: 'Redirect to Google OAuth' })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async googleAuth(@Req() req) {
        // Google OAuth logic
    }

    @Get('google/callback')
    @Public()
    @UseGuards(AuthGuard('google'))
    @ApiOperation({
        summary: 'Google OAuth Callback',
        description: 'Handle Google OAuth callback and generate JWT token',
        tags: ['auth', 'get'],
    })
    @ApiResponse({ status: 200, description: 'User has been authenticated and JWT token generated', type: String })
    async googleAuthRedirect(@Req() req): Promise<{ token: string }> {
        const user = req.user;
        return await this.authService.generateJwtToken(user);
    }
}