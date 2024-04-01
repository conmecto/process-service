import { redisClient1 as pubClient } from '../config';
import { Environments, enums, constants } from '../utils';
import findMaxSizeQueue from './maxSizeQueue';
import processMatchQueue from './processMatchQueue';
import { checkIfQueueProcessing, setQueueProcessingCheck } from './checkIfQueueProcessing';
import logger from './logger';

const handleProcessMatchQueueMessage = async (message: any, channel: string) => {
    if (checkIfQueueProcessing()) {
        return;
    }
    setQueueProcessingCheck(true);
    // const queueIndex = await findMaxSizeQueue();
    // if (!queueIndex) {
    //     return;
    // }
    for(let queueIndex = 1; queueIndex <= Environments.redis.maxNumberOfMatchQueue; queueIndex++) {
        try {
            await processMatchQueue(queueIndex);
        } catch(error) {
            await logger('Process Service: ' + enums.PrefixesForLogs.REDIS_PROCESS_MATCH_QUEUE_ERROR + error?.toString());
        }
    }
    setQueueProcessingCheck(false);
    setTimeout(async () => {
        await pubClient.publish(Environments.redis.channels.processMatchQueue, message);
    }, constants.PROCESS_MATCH_QUEUE_CALL_BUFFER_TIME_MILLIS);
}

export default handleProcessMatchQueueMessage;