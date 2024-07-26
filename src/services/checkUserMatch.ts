import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums } from '../utils';
import logger from './logger';

const checkUserMatch = async (userId: number): Promise<boolean> => {
    const query = 'SELECT id FROM match WHERE (user_id_1=$1 OR user_id_2=$1) AND ended=false ORDER BY created_at desc LIMIT 1';
    const params = [userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger(enums.PrefixesForLogs.DB_CHECK_USER_MATCH_ERROR + errorString);
    } finally {	
        client.release();
    } 
    return Boolean(res?.rows.length);
}

export default checkUserMatch;