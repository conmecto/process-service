import { Environments, enums } from '../utils';
import { redisClient1 as cacheClient } from '../config';
import logger from './logger';

const findMaxSizeQueue = async () => {
    let checkIfAllQueueEmpty = true; 
    let queueIndex = 1;
    try {
        const queueName = Environments.redis.matchQueue;
        let min = await cacheClient.lLen(queueName + '1');
        for(let i = 2; i <= Environments.redis.maxNumberOfMatchQueue; i++) {
            const tempSize = await cacheClient.lLen(queueName + `${i}`);
            if (tempSize > min) {
                min = tempSize;
                queueIndex = i;
            }
            if (min !== 0) {
                checkIfAllQueueEmpty = false;
            }
        }
        if (checkIfAllQueueEmpty) {
            return null;
        }
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger('Process Service: ' + enums.PrefixesForLogs.FIND_MAX_SIZE_QUEUE_ERROR + errorString);
    }
    return queueIndex;
}

export default findMaxSizeQueue;