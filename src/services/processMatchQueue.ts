import { redisClient1 as cacheClient } from '../config';
import { Environments, constants, enums } from '../utils';
import { setKey } from './cache';
import getUserMatchSettings from './getUserMatchSettings';
import createPossibleMatchForUser from './createPossibleMatchForUser';

const processMatchQueue = async (queueIndex: number) => {
    let userId = 0;
    const queueName = Environments.redis.matchQueue + queueIndex;
    const tempQueue: number[] = [];
    do {
        const tempUserId = await cacheClient.rPop(queueName);
        if (!tempUserId) {
            continue;
        }
        userId = Number(tempUserId);
        const userMatchSetting = await getUserMatchSettings(userId);
        if (!userMatchSetting || userMatchSetting.currentMatch) {
            continue;
        } 
        const possibleMatch = await createPossibleMatchForUser(userId, userMatchSetting);
        if (!possibleMatch) {
            tempQueue.push(userId);    
            continue;
        } 
        const matchedUserId = possibleMatch.userId2?.toString();
        await Promise.all([
            setKey(constants.CHECK_USER_MATCHED_KEY + userId, matchedUserId),
            setKey(constants.CHECK_USER_MATCHED_KEY + matchedUserId, userId?.toString()),
            cacheClient.publish(Environments.redis.channels.matchCreated, userId?.toString())
        ]);
    } while(userId);
    for(let i = 0; i < tempQueue.length; i++) {
        await cacheClient.lPush(queueName, userId?.toString()); 
    }
} 

export default processMatchQueue;