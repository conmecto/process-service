import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums, interfaces } from '../utils';

const saveChatMessage = async (data: interfaces.ISaveMessageData) => {
    const { sender, receiver, matchId, message, event } = data;
    if (event === enums.ChatSocketEvents.SAVE_FILE) {
        const saveChatWithFileRes = await saveChatMessageWithFile(data);
        return saveChatWithFileRes;
    }
    const query = `
        INSERT INTO chat
        (sender, receiver, match_id, type, message) 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING chat.id
    `;
    const params = [sender, receiver, matchId, 'text', message];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    } 
    return Boolean(res.rows.length);
}

const saveChatMessageWithFile = async (data: interfaces.ISaveMessageData) => {
    const { sender, fileData, receiver, matchId, message } = data;
    let query1Start = 'INSERT INTO file_metadata(user_id';
    let query1End = ') VALUES ($1';
    let count = 2;
    const params1: (string | undefined | number)[] = [sender];
    for(const key in fileData) {
        query1Start += `, ${key}`;
        query1End += `, $${count}`;
        params1.push(fileData[key]);
        count += 1;
    }
    const query1 = query1Start + query1End + ') RETURNING file_metadata.id';
    const query2 = `
        INSERT INTO chat
        (sender, receiver, match_id, type, message, location, file_metadata_id) 
        VALUES($1, $2, $3, $4, $5, $6, $7) 
        RETURNING chat.id
    `;
    const params2 = [sender, receiver, matchId, 'image', message, fileData.location];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        const insertFileRes = await client.query(query1, params1);
        if (!insertFileRes?.rows?.length) {
            throw new Error();
        } 
        params2.push(insertFileRes.rows[0].id);
        res = await client.query(query2, params2);
        await client.query('COMMIT');
    } catch(err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }  
    return Boolean(res.rows.length);
}

export default saveChatMessage;