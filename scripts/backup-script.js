import fs from 'fs';
import dotenv from 'dotenv';
import logger from '../logger.js';

dotenv.config();

const USER_PATH = process.env.USER_DATA_PATH;
const BACKUP_PATH = process.env.BACKUP_PATH;

const readStream = fs.createReadStream(USER_PATH, { encoding: 'utf8' });

const writeStream = fs.createWriteStream(BACKUP_PATH);

readStream.pipe(writeStream);

writeStream.on('finish', () => {
    logger.info('Backup completed successfully.');
});

writeStream.on('error', (err) => {
    logger.error(`An error occurred: ${err.message}`);
});
