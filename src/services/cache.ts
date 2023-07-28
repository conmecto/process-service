import { redisClient1 as cacheClient } from '../config';
import { enums, interfaces } from '../utils';

const setKey = async (key: string, value: string): Promise<boolean | null> => {
    let res: string | null = null;
    try {
        if (cacheClient.isReady) {
            res = await cacheClient.set(key.toLocaleLowerCase(), value);
        } 
    } catch(err) {
        console.error(enums.PrefixesForLogs.REDIS_SET_OBJECT + <string>err);
    }
    return Boolean(res);
}

const getKey = async (key: string): Promise<string | null> => {
    let value: string | null = null;
    try {
        if (cacheClient.isReady) {
            value = await cacheClient.get(key);
        }
    } catch(err) {
        console.error(enums.PrefixesForLogs.REDIS_GET_OBJECT + err);
    }
    return value;
}

export { setKey, getKey }

