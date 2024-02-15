import { Environments, enums } from '../utils';
import { redisClient1 as pubClient } from '../config';

const logger = async (error: string) => {
    try {
        const channel = Environments.redis.channels.logging;
        const check = pubClient?.isReady && channel;
    if (Environments.env !== 'prod' || !check) {
        console.log(error);
        return;
    }
    await pubClient.publish(
        channel, 
        error
    );
    } catch(err) {
        console.log(error);
        console.log(enums.PrefixesForLogs.REDIS_LOGGING_CHANNEL_ERROR + err);
    }
} 

export default logger;