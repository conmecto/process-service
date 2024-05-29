import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums, interfaces } from '../utils';

const updateMatchScore = async (matchId: number, sender: number, receiver: number, isFile: boolean = false) => {
    const query1 = `
        SELECT sq.sender, count(sq.id) AS is_message 
        FROM ( 
            SELECT id, sender
            FROM chat
            WHERE match_id=$1
            ORDER BY created_at DESC 
            LIMIT 10
        ) AS sq
        GROUP BY sq.sender
    `;
    const params1 = [matchId];
    const query2 = 'UPDATE match SET score=score+$2 WHERE id=$1 AND deleted_at IS NULL';
    const params2 = [matchId];
    const query3 = `
        UPDATE setting 
        SET total_match_score=total_match_score+$3 
        WHERE (user_id=$1 OR user_id=$2) AND deleted_at IS NULL
    `;
    const params3 = [sender, receiver];
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        const checkChatQuery = await client.query(query1, params1);
        if (checkChatQuery.rows.length === 2) {
            const score = 1 + (isFile ? 1 : 0);
            params2.push(score);
            params3.push(score);
            await Promise.all([
                client.query(query2, params2),
                client.query(query3, params3)
            ]);
        }
        await client.query('COMMIT');
    } catch(error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {	
        client.release();
    }
}

export default updateMatchScore;