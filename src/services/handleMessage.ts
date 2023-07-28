import { redisClient1 as pubClient, redisClient2 as subClient } from '../config';
import { Environments, enums } from '../utils';

export const handleProcessMatchQueueMessage = async (message: any, channel: string) => {
    try {
       
    } catch(error) {
        console.log(enums.PrefixesForLogs.REDIS_CHANNEL_MESSAGE_RECEIVE_ERROR + error);
//        await pubClient.publish(Environments.redis.channels.userCreatedMatchError, message);
    }
}