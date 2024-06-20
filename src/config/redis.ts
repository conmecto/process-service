import { createClient } from 'redis';
import { Environments, enums } from '../utils';
import { handleProcessMatchQueueMessage, handleSaveChatMessage, handleLogging, handleAccountRemovedMessage } from '../services'
import { checkIfQueueProcessing } from '../services/checkIfQueueProcessing';

const runRedisFile = () => {};

const redisClient1 = createClient({
    socket: {
        host: Environments.redis.host,
        port: Environments.redis.port,
        connectTimeout: Environments.redis.connectTimeout
    },
    username: Environments.redis.username, 
    password: Environments.redis.password
});

const redisClient2 = createClient({
    socket: {
        host: Environments.redis.host,
        port: Environments.redis.port,
        connectTimeout: Environments.redis.connectTimeout
    },
    username: Environments.redis.username, 
    password: Environments.redis.password
});

(async function connect() {
    await redisClient1.connect(); 
    console.log(enums.PrefixesForLogs.REDIS_CONNECTION_READY_CLIENT1 + redisClient1.isReady);
    if (!checkIfQueueProcessing() && redisClient1.isReady) {
        await handleProcessMatchQueueMessage(enums.Messages.MATCH_QUEUE_UPDATED, Environments.redis.channels.processMatchQueue);
    }
})();

(async function connect() {
    await redisClient2.connect(); 
    console.log(enums.PrefixesForLogs.REDIS_CONNECTION_READY_CLIENT2 + redisClient2.isReady);
    if (redisClient2.isReady) {
        await redisClient2.subscribe(Environments.redis.channels.processMatchQueue, handleProcessMatchQueueMessage);
        await redisClient2.subscribe(Environments.redis.channels.logging, handleLogging);
        await redisClient2.subscribe(Environments.redis.channels.saveMessage, handleSaveChatMessage);
        await redisClient2.subscribe(Environments.redis.channels.userAccountRemoved, handleAccountRemovedMessage);
    }
})();

redisClient1.on('error', (err) => {
    redisClient1.disconnect();
    console.error(enums.PrefixesForLogs.REDIS_CONNECTION_ERROR_CLIENT1 + err);
});

redisClient2.on('error', (err) => {
    redisClient2.disconnect();
    console.error(enums.PrefixesForLogs.REDIS_CONNECTION_ERROR_CLIENT2 + err);
});

export { redisClient1, redisClient2, runRedisFile };
