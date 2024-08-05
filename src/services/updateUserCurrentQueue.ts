import { getDbClient } from '../config';
import { QueryResult } from 'pg';

const updateUserCurrentQueue = async (userId: number, currentQueue: number) => {
	const query = 'UPDATE setting SET current_queue=$1 WHERE user_id=$2';
    const params = [currentQueue, userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }
    return Boolean(res?.rowCount);
} 

export default updateUserCurrentQueue;