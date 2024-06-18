import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, enums, constants } from '../utils';
import logger from './logger';

const createPossibleMatchForUser = async (userId: number, userSettings: interfaces.IGetSettingObject): Promise<interfaces.ICreatePossibleMatchResponse | null>  => { 
    const params1 = [userId, userSettings.minSearchAge, userSettings.maxSearchAge, userSettings.age, userSettings.searchIn];
    const query1 = `
        WITH user_embedding_query AS (
            SELECT id, embedding 
            FROM embeddings 
            WHERE user_id=$1 
            ORDER BY random() 
            LIMIT 1
        )
        SELECT e.user_id, e.id, (SELECT u.id FROM user_embedding_query u) AS user_embedding_id
        FROM embeddings e
        LEFT JOIN setting s ON s.user_id = e.user_id
        WHERE e.user_id!=$1 AND s.age>=$2 AND s.age<=$3 AND 
        s.max_search_age>=$4 AND s.min_search_age<=$4 AND s.search_in=$5 AND
        s.active_matches_count < max_matches_allowed AND   
        ${constants.GenderSearchForCombinations[userSettings.gender][userSettings.searchFor]} 
        AND s.user_id NOT IN 
        (
            SELECT 
            CASE 
                WHEN user_id_1=$1 THEN user_id_2
                ELSE user_id_1
            END as blocked_user 
            FROM match_block 
            WHERE (user_id_1=$1 OR user_id_2=$1)
        )
        ORDER BY (
            e.embedding <=> (SELECT u.embedding FROM user_embedding_query u)
        ) 
        LIMIT 1
    `;
    const query2 = 'INSERT INTO match(country, city, user_id_1, user_id_2) VALUES ($1, $2, $3, $4) RETURNING match.id';
    const query3 = 'UPDATE setting SET active_matches_count=active_matches_count+1 WHERE user_id=$1 OR user_id=$2';
    let res: QueryResult | null = null;
    let isMatched = false;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        const params2 = [userSettings.country, userSettings.searchIn, userId];
        const user = await client.query(query1, params1);
        if (!user?.rows?.length) {
            throw new Error();
        }
        params2.push(user.rows[0].user_id);
        res = await client.query(query2, params2);
        if (!user?.rows?.length) {
            throw new Error();
        }
        const params3 = [userId, user.rows[0].user_id];
        await client.query(query3, params3);
        await client.query('COMMIT');
        isMatched = true;
    } catch (error) {
        await logger('Process Service: ' + enums.PrefixesForLogs.DB_CREATE_POSSIBLE_MATCH_ERROR + userId?.toString() + ' ' + error?.toString());
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
    if (isMatched) {
        const check = res?.rows?.length ? { 
            matchId: <number>res.rows[0].id 
        } : null;
        return check;
    }
    return null;
}

export default createPossibleMatchForUser;