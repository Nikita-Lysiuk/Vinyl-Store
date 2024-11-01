import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesService {
    async readDataFromFile<T>(filePath: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(filePath, 'utf8');
            let data = '';
            readStream.on('data', (chunk) => {
                data += chunk;
            });

            readStream.on('end', () => {
                if (!data) {
                    resolve([]);
                }
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });

            readStream.on('error', (error) => {
                reject(error);
            });
        });
    }

    async writeDataToFile<T>(filePath: string, data: T[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(filePath, {
                encoding: 'utf8',
            });

            writeStream.on('error', (error) => {
                reject(error);
            });

            writeStream.on('finish', () => {
                resolve();
            });

            writeStream.write(JSON.stringify(data, null, 2), (error) => {
                if (error) {
                    reject(error);
                } else {
                    writeStream.end();
                }
            });
        });
    }
}
