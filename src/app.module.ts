import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyLoggerService } from './common/logger.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    providers: [MyLoggerService],
    exports: [MyLoggerService],
})
export class AppModule {}
