import { redisClient1 as cacheClient } from '../config';
import { Environments } from '../utils';
import checkUserMatchPossible from './checkUserMatchPossible';
import createPossibleMatchForUser from './createPossibleMatchForUser';
import { findNearbyUsers } from './geohash';

const processMatchQueue = async () => {
    const tempQueue: number[] = [];
    const queueName = Environments.redis.matchQueue;
    let size = await cacheClient.lLen(queueName);
    while(size-- > 0) {
        let userId: string | number | null = await cacheClient.rPop(queueName);
        if (!userId) {
            continue;
        }
        userId = Number(userId);
        const userMatchSetting = await checkUserMatchPossible(userId);
        if (!userMatchSetting) {
            tempQueue.push(userId); 
            continue;
        }
        const nearbyUsers = await findNearbyUsers(userId, userMatchSetting.geohash, userMatchSetting.searchArea);
        if (!nearbyUsers || !Object.keys(nearbyUsers).length) {
            tempQueue.push(userId); 
            continue;
        }
        const possibleMatch = await createPossibleMatchForUser(userId, userMatchSetting, nearbyUsers);
        if (possibleMatch) {
            await cacheClient.publish(
                Environments.redis.channels.matchCreatedNotification, 
                Buffer.from(JSON.stringify({ userId }))
            );
            await cacheClient.publish(
                Environments.redis.channels.matchCreatedNotification, 
                Buffer.from(JSON.stringify({ userId: possibleMatch.matchedUserId }))
            );
        } 
        tempQueue.push(userId); 
    }
    tempQueue.forEach(async id => {
        await cacheClient.lPush(queueName, id?.toString()); 
    });
} 

export default processMatchQueue;