import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.exrtactToken(request);
        if (!token) {
            throw new UnauthorizedException('User not authenticated');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException(
                'User not authenticated' + error.message
            );
        }
        return true;
    }

    private exrtactToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') || [];
        return type === 'Bearer' ? token : undefined;
    }
}
