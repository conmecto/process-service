import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums } from '../utils';

const checkUserMatch = async (userId: number): Promise<boolean> => {
    const query = 'SELECT id FROM match WHERE (user_id_1=$1 OR user_id_2=$1) AND ended=false ORDER BY created_at desc LIMIT 1';
    const params = [userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_CHECK_USER_MATCH_ERROR + error);
        throw error;
    } finally {	
        client.release();
    } 
    return Boolean(res.rows.length);
}

export default checkUserMatch;