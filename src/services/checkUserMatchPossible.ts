import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, enums, helpers } from '../utils';
import logger from './logger';

const checkUserMatchPossible = async (userId: number) => {
    const query = `
        SELECT s.id, s.gender, s.max_search_age, s.min_search_age, s.search_for, 
        s.max_matches_allowed, s.active_matches_count, ls.search_area, ls.geohash, ls.country,
        CASE 
            WHEN s.dob IS NULL THEN NULL
            ELSE EXTRACT(YEAR FROM AGE(s.dob))
        END AS age 
        FROM setting s
        LEFT JOIN location_setting ls ON s.user_id=ls.user_id
        WHERE 
        s.dob IS NOT NULL AND
        s.active_matches_count < s.max_matches_allowed AND 
        ls.geohash IS NOT NULL AND 
        s.user_id IN (
            SELECT e.user_id
            FROM embeddings e
            WHERE e.user_id=$1
            LIMIT 1
        ) AND 
        s.deleted_at IS NULL
    `;
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
        await logger(enums.PrefixesForLogs.DB_CHECK_USER_MATCH_POSSIBLE + errorString);
    } finally {	
        client.release();
    }  
    const setting = res?.rows[0];  
    if (setting) {
        return helpers.formatDbQueryResponse<interfaces.IGetSettingObject>(setting);
    } 
    return null;
}

export default checkUserMatchPossible;