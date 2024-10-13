import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

export interface jPackage {
    version: string;
}

@Injectable()
export class HealthService {
    getVersion(): jPackage {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return { version: packageJson.version };
    }
}
