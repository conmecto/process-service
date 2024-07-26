import { redisClient1 as pubClient } from '../config';
import { Environments, enums, constants } from '../utils';
import processMatchQueue from './processMatchQueue';
import { checkIfQueueProcessing, setQueueProcessingCheck } from './checkIfQueueProcessing';
import logger from './logger';

const handleProcessMatchQueueMessage = async (message: any, channel: string) => {
    if (checkIfQueueProcessing()) {
        return;
    }
    setQueueProcessingCheck(true);
    try {
        await processMatchQueue();
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger(enums.PrefixesForLogs.REDIS_PROCESS_MATCH_QUEUE_ERROR + errorString);
    }
    setQueueProcessingCheck(false);
    setTimeout(async () => {
        await pubClient.publish(Environments.redis.channels.processMatchQueue, message);
    }, constants.PROCESS_MATCH_QUEUE_CALL_BUFFER_TIME_MILLIS);
}

export default handleProcessMatchQueueMessage;