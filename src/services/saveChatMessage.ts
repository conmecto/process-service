import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums, interfaces } from '../utils';

const saveChatMessage = async ({ sender, receiver, matchId, message }: interfaces.ISaveMessageData): Promise<boolean> => {
    const query = 'INSERT INTO chat(sender, receiver, match_id, type, message) VALUES($1, $2, $3, $4, $5) RETURNING chat.id';
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

export default saveChatMessage;