import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

export interface jPackage {
    version: string;
}

@Injectable()
export class HealthService {
    async getVersion(): Promise<jPackage> {
        const packageJson = JSON.parse(
            await fs.promises.readFile('./package.json', 'utf-8')
        );
        return { version: packageJson.version };
    }
}
