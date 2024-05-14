import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums, interfaces } from '../utils';

const updateMatchScore = async (matchId: number, sender: number, receiver: number) => {
    const query1 = 'SELECT C.id, C.sender FROM (SELECT id, sender FROM chat WHERE match_id=$1 ORDER BY created_at DESC LIMIT 10) AS C WHERE C.sender=$2 LIMIT 1';
    const query2 = 'UPDATE match SET score=score+$2 WHERE id=$1 AND deleted_at IS NULL';
    const query3 = 'UPDATE setting SET total_match_score=total_match_score+$3 WHERE (user_id=$1 OR user_id=$2) AND deleted_at IS NULL';
    const params3 = [sender, receiver];
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        const params1 = [matchId, sender];
        const user1 = await client.query(query1, params1);
        params1[1] = receiver;
        const user2 = await client.query(query1, params1);
        const params2 = [matchId];
        if (user1.rows.length && user2.rows.length) {
            params2.push(2);
            params3.push(2);
        } else {
            params2.push(1);
            params3.push(1);
        }
        await Promise.all([
            client.query(query2, params2),
            client.query(query3, params3)
        ]);
        await client.query('COMMIT');
    } catch(error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {	
        client.release();
    }
}

export default updateMatchScore;