import { Worker, Job } from 'bullmq';
import { Environments } from '../utils';
import { 
    logger,
    handleAddSettingsMessage
} from '../services';

const createUserSettingWorker = new Worker('createUserSettingQueue', async (job: Job) => {
    const res = await handleAddSettingsMessage(job.data);
    return res;
}, {
    connection: {
        host: Environments.redis.host,
        port: Environments.redis.port,
        username: Environments.redis.username,
        password: Environments.redis.password
    }
});

createUserSettingWorker.on('failed', (job: Job | undefined, error: Error) => {
    const failedError = JSON.stringify({
        message: error?.message,
        stack: error?.stack 
    });
    logger('Create User Setting Worker Failed: ' + failedError);
});

createUserSettingWorker.on('error', err => {
    const error = JSON.stringify({
        message: err?.message,
        stack: err?.stack 
    });
    logger('Create User Setting Worker Error: ' + error);
});

export default createUserSettingWorker;