import { redisClient1 as cacheClient } from '../config';
import { enums } from '../utils';
import logger from './logger';

const setKey = async (key: string, value: string): Promise<boolean | null> => {
    let res: string | null = null;
    try {
        if (cacheClient.isReady) {
            res = await cacheClient.set(key.toLocaleLowerCase(), value);
        } 
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger('Process Service: ' + enums.PrefixesForLogs.REDIS_SET_OBJECT + <string>errorString);
    }
    return Boolean(res);
}

const getKey = async (key: string): Promise<string | null> => {
    let value: string | null = null;
    try {
        if (cacheClient.isReady) {
            value = await cacheClient.get(key);
        }
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger('Process Service: ' + enums.PrefixesForLogs.REDIS_GET_OBJECT + errorString);
    }
    return value;
}

export { setKey, getKey }

