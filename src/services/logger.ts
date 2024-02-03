import { Environments, enums } from '../utils';
import { redisClient1 as pubClient } from '../config';

const logger = async (error: string) => {
    try {
        if (Environments.env !== 'prod') {
            console.log(error);
            return;
        }
        const channel = Environments.redis.channels.logging;
        if (pubClient?.isReady && channel) {
            await pubClient.publish(
                channel, 
                error
            );
        }
    } catch(err) {
        console.log(error);
        console.log(enums.PrefixesForLogs.REDIS_LOGGING_CHANNEL_ERROR + err);
    }
} 

export default logger;