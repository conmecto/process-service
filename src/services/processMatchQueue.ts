import { redisClient1 as cacheClient } from '../config';
import { Environments } from '../utils';
import getUserMatchSettings from './getUserMatchSettings';
import createPossibleMatchForUser from './createPossibleMatchForUser';
import checkUserMatch from './checkUserMatch';

const processMatchQueue = async (queueIndex: number) => {
    const queueName = Environments.redis.matchQueue + queueIndex;
    const tempQueue: number[] = [];
    let size = await cacheClient.lLen(queueName);
    while(size-- > 0) {
        let userId: string | number | null = await cacheClient.rPop(queueName);
        if (!userId) {
            continue;
        }
        userId = Number(userId);
        const userMatchSetting = await getUserMatchSettings(userId);
        const isUserMatched = await checkUserMatch(userId);
        if (!userMatchSetting || isUserMatched) {
            continue;
        } 
        const possibleMatch = await createPossibleMatchForUser(userId, userMatchSetting);
        if (!possibleMatch) {
            tempQueue.push(userId);    
            continue;
        } 
        await cacheClient.publish(Environments.redis.channels.matchCreatedNotification, Buffer.from(JSON.stringify({ userId })));
    }
    tempQueue.forEach(async id => {
        await cacheClient.lPush(queueName, id?.toString()); 
    });
} 

export default processMatchQueue;