import { redisClient1 as pubClient } from '../config';
import { Environments, enums } from '../utils';
import findMaxSizeQueue from './maxSizeQueue';
import processMatchQueue from './processMatchQueue';

const handleProcessMatchQueueMessage = async (message: any, channel: string) => {
    const queueIndex = await findMaxSizeQueue();
    if (!queueIndex) {
        return;
    }
    try {
        await processMatchQueue(queueIndex);
    } catch(error) {
        console.log(enums.PrefixesForLogs.REDIS_PROCESS_MATCH_QUEUE_ERROR + error);
    }
    await pubClient.publish(Environments.redis.channels.processMatchQueue, message);
}

export default handleProcessMatchQueueMessage;