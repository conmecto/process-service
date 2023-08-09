import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums, helpers } from '../utils';

const getUserMatchSettings = async (userId: number): Promise<interfaces.IGetSettingObject> => {
    const query = 'SELECT age, country, current_match, gender, max_search_age, min_search_age, search_for, search_in FROM setting WHERE user_id=$1';
    const params = [userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_GET_MATCH_SETTING_ERROR + error);
        throw error;
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
            currentMatch: setting?.current_match,
        }, ['max_search_age', 'min_search_age', 'search_in', 'search_for', 'current_match']);
    } 
    return setting;
}

export default getUserMatchSettings;