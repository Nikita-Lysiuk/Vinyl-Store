import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly prismaService: PrismaService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const endpoint = request.url;
        const userId = request.user?.sub;

        if (['POST', 'PUT', 'DELETE'].includes(method)) {
            return next.handle().pipe(
                tap(async () => {
                    await this.prismaService.logs.create({
                        data: {
                            action: `${method} request to ${endpoint}`,
                            userId: userId || 0,
                            method,
                            endpoint,
                        },
                    });
                }),
            );
        }

        return next.handle();
    }
}
