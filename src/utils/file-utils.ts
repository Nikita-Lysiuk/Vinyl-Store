import fs, { ReadStream } from 'fs';

export function readDataFromFile<T>(path: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const readStream: ReadStream = fs.createReadStream(path, { encoding: 'utf-8' });
        let data = '';

        readStream.on('data', (chunk: string) => {
            data += chunk;
        });

        readStream.on('end', () => {
            try {
                if (!data) {
                    resolve([]);
                    return;
                }
                const parsedData: T[] = JSON.parse(data);
                resolve(parsedData);
            } catch (error) {
                reject(error);
            }
        });

        readStream.on('error', (error) => {
            reject(error);
        });
    });
}

export function writeDataToFile<T>(path: string, data: T[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const writeStream: fs.WriteStream = fs.createWriteStream(path);
        writeStream.write(JSON.stringify(data, null, 2), 'utf-8');
        writeStream.end();

        writeStream.on('finish', () => {
            resolve();
        });

        writeStream.on('error', (error) => {
            reject(error);
        });
    });
}