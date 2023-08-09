import { Environments } from '../utils';
import { redisClient1 as cacheClient } from '../config';

const findMaxSizeQueue = async () => {
    let checkIfAllQueueEmpty = true; 
    let queueIndex = 1;
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
    return queueIndex;
}

export default findMaxSizeQueue;