import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
    private readonly s3: AWS.S3;

    constructor(private readonly configService: ConfigService) {
        this.s3 = new AWS.S3({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const params = {
            Bucket: this.configService.get('BUCKET_NAME_S3'),
            Key: Date.now() + String(file.originalname),
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        try {
            return (await this.s3.upload(params).promise()).Location;
        } catch (error) {
            throw new Error('Something went wrong ' + error);
        }
    }
}