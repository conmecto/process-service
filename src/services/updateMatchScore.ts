import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums, interfaces } from '../utils';

const updateMatchScore = async (matchId: number, sender: number, receiver: number): Promise<boolean> => {
    const query1 = 'SELECT C.id, C.sender FROM (SELECT id, sender FROM chat WHERE match_id=$1 ORDER BY created_at DESC LIMIT 10) AS C WHERE C.sender=$2 LIMIT 1';
    const query2 = 'UPDATE chat SET score=score+$2 WHERE match_id=$1 AND deleted_at IS NULL';
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        console.log(query1);
        const params1 = [matchId, sender];
        console.log(params1);
        const user1 = await client.query(query1, params1);
        const params2 = [matchId, receiver];
        console.log(params2);
        const user2 = await client.query(query1, params2);
        const params3 = [matchId];
        if (user1.rows.length && user2.rows.length) {
            params3.push(2);
        } else {
            params3.push(1);
        }
        console.log(params3);
        res =  await client.query(query2, params3);
        await client.query('COMMIT');
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_UPDATE_MATCH_SCORE_ERROR + error);
        await client.query('ROLLBACK');
        throw error;
    } finally {	
        client.release();
    } 
    return Boolean(res?.rowCount);
}

export default updateMatchScore;