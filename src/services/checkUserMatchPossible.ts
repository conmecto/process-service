import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';
import logger from './logger';

const checkUserMatchPossible = async (userId: number): Promise<interfaces.IGetSettingObject> => {
    // const query = `
    //     SELECT id, age, country, gender, max_search_age, min_search_age, search_for, 
    //     search_in, m.id as match_id, e.id as embedding_id 
    //     FROM setting s 
    //     LEFT JOIN LATERAL (
    //         SELECT id 
    //         FROM match m 
    //         WHERE (m.user_id_1 = s.user_id OR m.user_id_2 = s.user_id) AND m.ended=false 
    //         ORDER BY m.created_at 
    //         DESC LIMIT 1
    //     ) m ON true 
    //     LEFT JOIN embeddings e ON (e.user_id = s.user_id) 
    //     WHERE s.user_id=$1
    // `;
    const query = `
        SELECT id, age, country, gender, max_search_age, min_search_age, search_for, 
        search_in, max_matches_allowed, active_matches_count
        FROM setting s
        WHERE s.user_id=$1
    `;
    const params = [userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        await logger('Process Service: ' + enums.PrefixesForLogs.DB_CHECK_USER_MATCH_POSSIBLE + error?.toString());
    } finally {	
        client.release();
    }  
    const setting = res?.rows[0];  
    if (setting) {
        return <interfaces.IGetSettingObject>omit({
            ...setting,
            maxSearchAge: setting?.max_search_age,
            minSearchAge: setting?.min_search_age,
            searchFor: setting?.search_for,
            searchIn: setting?.search_in,
            activeMatchesCount: setting?.active_matches_count,
            maxMatchesAllowed: setting?.max_matches_allowed
        }, ['max_search_age', 'min_search_age', 'search_in', 'search_for', 'max_matches_allowed', 'active_matches_count']);
    } 
    return setting;
}

export default checkUserMatchPossible;