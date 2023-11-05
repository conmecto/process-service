import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, enums, helpers, constants } from '../utils';

const createPossibleMatchForUser = async (userId: number, userSettings: interfaces.IGetSettingObject): Promise<interfaces.ICreatePossibleMatchResponse | null>  => {    
    const searchAge: number[] = [];
    for(let i = userSettings.minSearchAge; i <= userSettings.maxSearchAge; i++) {
        searchAge.push(i);
    }
    const query1 = `SELECT user_id FROM SETTING WHERE user_id!=$1 AND age IN (${searchAge.join(',')}) AND max_search_age>=$2
        AND min_search_age<=$2 AND search_in=$3 AND is_matched=false AND  
        ${constants.GenderSearchForCombinations[userSettings.gender][userSettings.searchFor]} 
        AND user_id NOT IN 
        (
            (SELECT user_id_1 as blocked_user FROM match_block WHERE user_id_2=$1)
            UNION 
            (SELECT user_id_2 as blocked_user FROM match_block WHERE user_id_1=$1)
        )
        ORDER BY active_score_second DESC, avg_match_time DESC
        LIMIT 1`;
    const query2 = 'INSERT INTO match(country, city, user_id_1, user_id_2) VALUES ($1, $2, $3, $4) RETURNING match.id';
    const query3 = 'UPDATE setting set is_matched=true, current_queue=NULL WHERE user_id=$1 OR user_id=$2';
    const params1 = [userId, userSettings.age, userSettings.searchIn];

    let res: QueryResult | null = null;
    let isMatched = false;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        const params2 = [userSettings.country, userSettings.searchIn, userId];
        console.log(query1);
        console.log(params1);
        const user = await client.query(query1, params1);
        if (!user?.rows?.length) {
            throw new Error();
        }
        params2.push(user.rows[0].user_id);
        console.log(query2);
        console.log(params2);
        res = await client.query(query2, params2);
        if (!user?.rows?.length) {
            throw new Error();
        }
        const params3 = [userId, user.rows[0].user_id];
        console.log(query3);
        console.log(params3);
        await client.query(query3, params3);
        await client.query('COMMIT');
        isMatched = true;
    } catch (error) {
        console.error(enums.PrefixesForLogs.DB_CREATE_POSSIBLE_MATCH_ERROR + error);
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