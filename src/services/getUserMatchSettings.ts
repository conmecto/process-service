import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';
import logger from './logger';

const getUserMatchSettings = async (userId: number): Promise<interfaces.IGetSettingObject> => {
    const query = 'SELECT age, country, gender, max_search_age, min_search_age, search_for, search_in FROM setting WHERE user_id=$1';
    const params = [userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        await logger('Process Service: ' + enums.PrefixesForLogs.DB_GET_MATCH_SETTING_ERROR + JSON.stringify(error));
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
        }, ['max_search_age', 'min_search_age', 'search_in', 'search_for']);
    } 
    return setting;
}

export default getUserMatchSettings;