import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, enums, helpers, constants } from '../utils';

const createPossibleMatchForUser = async (userId: number, userSettings: interfaces.IGetSettingObject): Promise<interfaces.ICreatePossibleMatchResponse | null>  => {    
    const query1 = `SELECT user_id FROM SETTING WHERE user_id!=$1 AND age=$2 AND max_search_age>=$3
        AND min_search_age<=$3 AND search_in=$4 AND current_match=NULL AND  
        ${constants.GenderSearchForCombinations[userSettings.gender][userSettings.searchFor]} 
        AND user_id NOT IN 
        (
            (SELECT user_id_1 as blocked_user FROM match_block WHERE user_id_2=$1)
            UNION 
            (SELECT user_id_2 as blocked_user FROM match_block WHERE user_id_1=$1)
        )
        ORDER BY active_score_second DESC, avg_match_time DESC
        LIMIT 1`;
    const query2 = 'INSERT INTO match(user_id_1, user_id_2) VALUES ($1, $2) RETURNING match.id';
    const query3 = `UPDATE setting 
        SET current_match= 
        CASE
            WHEN user_id=$1 THEN $2
            WHEN user_id=$2 THEN $1
        END
        WHERE user_id IN ($1, $2)`;
    const searchAge = helpers.getRandomNumberMinMax(userSettings.minSearchAge, userSettings.maxSearchAge);
    const params1 = [userId, searchAge, userSettings.age, userSettings.searchIn];

    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        const params2 = [userId];
        console.log(query1);
        console.log(query2);
        console.log(params1);
        const user = await client.query(query1, params1);
        if (!user?.rows?.length) {
            throw new Error();
        }
        params2.push(user.rows[0].user_id);
        console.log(params2);
        res = await client.query(query2, params2);
        if (!user?.rows?.length) {
            throw new Error();
        }
        await client.query(query3, params2);
        await client.query('COMMIT');
    } catch (error) {
        console.error(enums.PrefixesForLogs.DB_CREATE_POSSIBLE_MATCH_ERROR + error);
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
    const check = res?.rows?.length ? { 
        matchId: <number>res.rows[0].id 
    } : null;
    return check;
}

export default createPossibleMatchForUser;