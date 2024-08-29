import { QueryResult } from 'pg';
import { getDbClient } from '../config';

const addSetting = async (userId: number, country: string) => {
    const query1 = `
        INSERT INTO 
        setting(user_id) 
        VALUES ($1) 
        RETURNING setting.id
    `;
    const params1 = [userId];
    const query2 = `
        INSERT INTO 
        location_setting(user_id, country) 
        VALUES ($1, $2)
    `;
    const params2 = [userId, country];
    const query3 = `
        INSERT INTO 
        text_gen_setting(user_id) 
        VALUES ($1)
    `;
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        res = await client.query(query1, params1);
        await client.query(query2, params2);
        await client.query(query3, params1);
        await client.query('COMMIT');
    } catch(error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {	
        client.release();
    }  
    return Boolean(res?.rowCount);
}

export default addSetting;