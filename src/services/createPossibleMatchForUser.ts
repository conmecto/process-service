import { getDbClient } from '../config';
import { interfaces, enums, constants } from '../utils';
import logger from './logger';

const createPossibleMatchForUser = async (userId: number, userSettings: interfaces.IGetSettingObject, nearbyUsers: interfaces.IGeneric)  => { 
    //search area not considered
    const nearbyUserIds = Object.keys(nearbyUsers);
    const userIdValues = nearbyUserIds.map((id, index) => `$${index+5}`).join(',');
    const query1 = `
        WITH user_embedding_query AS (
            SELECT id, embedding 
            FROM embeddings 
            WHERE user_id=$1 
            ORDER BY random() 
            LIMIT 1
        ), blocked_users AS (
            SELECT 
            CASE 
                WHEN user_id_1=$1 THEN user_id_2
                ELSE user_id_1
            END as excepted_user 
            FROM match_block 
            WHERE (user_id_1=$1 OR user_id_2=$1)
        ), matched_users AS (
            SELECT 
            CASE 
                WHEN user_id_1=$1 THEN user_id_2
                ELSE user_id_1
            END as excepted_user 
            FROM match 
            WHERE (user_id_1=$1 OR user_id_2=$1) AND ended=FALSE AND deleted_at is NULL
        )
        SELECT e.user_id, e.id AS embedding_2, (SELECT u.id FROM user_embedding_query u) AS embedding_1
        FROM embeddings e
        LEFT JOIN setting s ON s.user_id = e.user_id
        WHERE 
        e.user_id!=$1 AND 
        s.dob IS NOT NULL AND
        s.user_id IN (${userIdValues}) AND
        EXTRACT(year from age(s.dob))>=$2 AND EXTRACT(year from age(s.dob))<=$3 AND 
        s.max_search_age>=$4 AND s.min_search_age<=$4 AND 
        s.active_matches_count < max_matches_allowed AND   
        ${constants.GenderSearchForCombinations[userSettings.gender][userSettings.searchFor]} 
        AND s.user_id NOT IN 
        (
            SELECT excepted_user FROM blocked_users
            UNION
            SELECT excepted_user FROM matched_users
        )
        AND e.deleted_at IS NULL
        ORDER BY (
            e.embedding <=> (SELECT u.embedding FROM user_embedding_query u)
        ) ASC
        LIMIT 1
    `;
    const query2 = `
        INSERT INTO 
        match(country, user_id_1, geohash_1, embedding_1, user_id_2, geohash_2, embedding_2) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING match.id
    `;
    const query3 = `
        UPDATE setting 
        SET active_matches_count=active_matches_count+1 
        WHERE user_id=$1 OR user_id=$2
    `;
    const params1 = [
        userId, userSettings.minSearchAge, userSettings.maxSearchAge, 
        userSettings.age, ...nearbyUserIds
    ];
    let createMatchRes: interfaces.ICreatePossibleMatchResponse | null = null;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        const matchedUserRes = await client.query(query1, params1);
        if (!matchedUserRes?.rows?.length) {
            throw new Error('No match found');
        }
        const params2 = [userSettings.country, userId, userSettings.geohash];
        const matchedUserId = matchedUserRes.rows[0].user_id;
        const userEmbeddingId = matchedUserRes.rows[0].embedding_1;
        const matchedUserEmbeddingId = matchedUserRes.rows[0].embedding_2;
        const matchedUserGeohash = nearbyUsers[matchedUserId];
        params2.push(userEmbeddingId);
        params2.push(matchedUserId);
        params2.push(matchedUserGeohash);
        params2.push(matchedUserEmbeddingId);
        const matchRes = await client.query(query2, params2);
        if (!matchRes?.rows?.length) {
            throw new Error('Create Match Failed');
        }
        const params3 = [userId, matchedUserId];
        await client.query(query3, params3);
        await client.query('COMMIT');
        createMatchRes = {
            userId,
            matchId: matchRes.rows[0].id,
            matchedUserId: matchedUserId
        }
    } catch (error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger(enums.PrefixesForLogs.DB_CREATE_POSSIBLE_MATCH_ERROR + userId?.toString() + ' ' + errorString);
        await client.query('ROLLBACK');
    } finally {
        client.release();
    } 
    return createMatchRes;
}

export default createPossibleMatchForUser;