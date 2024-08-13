import { config } from 'dotenv';
import { join } from 'path';

if (process.env.NODE_ENV === 'dev') {
    const path = join(__dirname, '..', '..', '.env');
    config({ path });
}

export default {
    env: process.env.NODE_ENV || 'dev',
    server: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 8083
    },
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        database: process.env.DB_NAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        keyName: process.env.DB_KEY_NAME || ''
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY || 'TEMP_KEY',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'TEMP_SECRET_KEY',
        s3ACL: process.env.AWS_S3_ACL || 'TEMP_S3_ACL',
        s3Region: process.env.AWS_S3_REGION || 'TEMP_REGION',
        s3LogBucket: process.env.AWS_S3_LOG_BUCKET || 'TEMP_BUCKET'
    },
    redis: {
        host: process.env.REDIS_HOST || 'REDIS_HOST',
        port: Number(process.env.REDIS_PORT) || 6379, 
        username: process.env.REDIS_USERNAME || 'REDIS_USERNAME',
        password: process.env.REDIS_PASSWORD || 'REDIS_PASSWORD',
        channels: {
            processMatchQueue: process.env.REDIS_CHANNEL_PROCESS_MATCH_QUEUE || 'process-match-queue',
            matchCreated: process.env.REDIS_CHANNEL_MATCH_CREATED || 'match-created',
            saveMessage: process.env.REDIS_CHANNEL_SAVE_MESSAGE || 'save-message',
            logging: process.env.REDIS_CHANNEL_LOGGING || 'logging-channel',
            matchCreatedNotification: 'match-created-notification',
            userAccountRemoved: 'user-account-removed'
        },
        matchQueue: process.env.MATCH_QUEUE || 'match-queue',
        connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT) || 30000,
        maxNumberOfMatchQueue: Number(process.env.REDIS_MAX_NUMBER_OF_MATCH_QUEUE) || 1
    },
    token: {
        publicKey: process.env.TOKEN_PUBLIC_KEY || 'TEMP_PUBLIC_KEY'
    },
    email: process.env.email || 'temp email'
};