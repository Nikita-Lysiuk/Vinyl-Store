import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

export function imageFileInterceptor(fieldName: string) {
    return FileInterceptor(fieldName, {
        storage: multer.memoryStorage(),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (_, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return callback(
                    new BadRequestException('must be an image file'),
                    false
                );
            }
            callback(null, true);
        },
    });
}