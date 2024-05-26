import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, enums, constants } from '../utils';
import logger from './logger';

const createPossibleMatchForUser = async (userId: number, userSettings: interfaces.IGetSettingObject): Promise<interfaces.ICreatePossibleMatchResponse | null>  => { 
    const searchAge: number[] = [];
    for(let i = userSettings.minSearchAge; i <= userSettings.maxSearchAge; i++) {
        searchAge.push(i);
    }
    // const query1 = `SELECT user_id FROM setting WHERE user_id!=$1 AND age IN (${searchAge.join(',')}) AND max_search_age>=$2
    //     AND min_search_age<=$2 AND search_in=$3 AND is_matched=false AND  
    //     ${constants.GenderSearchForCombinations[userSettings.gender][userSettings.searchFor]} 
    //     AND user_id NOT IN 
    //     (
    //         (SELECT user_id_1 as blocked_user FROM match_block WHERE user_id_2=$1)
    //         UNION 
    //         (SELECT user_id_2 as blocked_user FROM match_block WHERE user_id_1=$1)
    //     )
    //     ORDER BY avg_match_time DESC
    //     LIMIT 10`;
        //        ORDER BY active_score_second DESC, avg_match_time DESC
    // const query1 = `
    //     WITH filter_query AS (
    //         SELECT s.user_id, e.embedding
    //         FROM setting s 
    //         LEFT JOIN embeddings e ON s.user_id=e.user_id
    //         WHERE s.user_id!=$1 AND s.age IN (${searchAge.join(',')}) AND s.max_search_age>=$2
    //         AND s.min_search_age<=$2 AND s.search_in=$3 AND s.is_matched=false AND  
    //         ${constants.GenderSearchForCombinations[userSettings.gender][userSettings.searchFor]} 
    //         AND s.user_id NOT IN 
    //         (
    //             (SELECT user_id_1 as blocked_user FROM match_block WHERE user_id_2=$1)
    //             UNION 
    //             (SELECT user_id_2 as blocked_user FROM match_block WHERE user_id_1=$1)
    //         )
    //         ORDER BY s.avg_match_time DESC
    //         LIMIT 50
    //     )
    //     SELECT f.user_id FROM filter_query f ORDER BY (f.embedding <=> (SELECT embedding FROM embeddings WHERE user_id=$1)) LIMIT 1
    // `;
    const query1 = 'SELECT user_id FROM setting WHERE user_id<>$1 AND active_matches_count < max_matches_allowed ORDER BY created_at ASC';
    const query2 = 'INSERT INTO match(country, city, user_id_1, user_id_2) VALUES ($1, $2, $3, $4) RETURNING match.id';
    const query3 = 'UPDATE setting SET active_matches_count=active_matches_count+1 WHERE user_id=$1 OR user_id=$2';
    const params1 = [userId, userSettings.age, userSettings.searchIn];
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