import { Environments, enums } from '../utils';
import removeSetting from './removeSetting';
import logger from './logger';

const handleAccountRemovedMessage = async (message: any, channel: string) => {
    try {
        const { userId } = JSON.parse(message);
        if (Environments.redis.channels.userAccountRemoved === channel && userId) {
            await removeSetting(Number(userId));
        }
    } catch(err) {
        await logger('Process Service: ' + enums.PrefixesForLogs.REDIS_CHANNEL_MESSAGE_RECEIVE_ERROR + err?.toString());
    }
}

export default handleAccountRemovedMessage;