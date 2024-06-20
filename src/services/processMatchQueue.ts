import { redisClient1 as cacheClient } from '../config';
import { Environments } from '../utils';
import checkUserMatchPossible from './checkUserMatchPossible';
// import getUserMatchSettings from './getUserMatchSettings';
import createPossibleMatchForUser from './createPossibleMatchForUser';
//import checkUserMatch from './checkUserMatch';

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
        const userMatchSetting = await checkUserMatchPossible(userId);
        if (!userMatchSetting) {
            continue;
        }
        if (userMatchSetting.activeMatchesCount >= userMatchSetting.maxMatchesAllowed) {
            tempQueue.push(userId); 
            continue;
        }
        const possibleMatch = await createPossibleMatchForUser(userId, userMatchSetting);
        if (possibleMatch) {
            await cacheClient.publish(Environments.redis.channels.matchCreatedNotification, Buffer.from(JSON.stringify({ userId })));
        } 
        tempQueue.push(userId); 
    }
    tempQueue.forEach(async id => {
        await cacheClient.lPush(queueName, id?.toString()); 
    });
} 

export default processMatchQueue;