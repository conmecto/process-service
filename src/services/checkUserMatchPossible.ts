import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';
import logger from './logger';

const checkUserMatchPossible = async (userId: number): Promise<interfaces.IGetSettingObject> => {
    const query = `
        SELECT id, age, country, gender, max_search_age, min_search_age, search_for, 
        search_in, max_matches_allowed, active_matches_count
        FROM setting s
        WHERE s.user_id IN (
            SELECT e.user_id
            FROM embeddings e
            WHERE e.user_id=$1
            LIMIT 1
        ) AND deleted_at IS NULL
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
        await logger('Process Service: ' + enums.PrefixesForLogs.DB_CHECK_USER_MATCH_POSSIBLE + errorString);
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