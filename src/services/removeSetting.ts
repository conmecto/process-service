import { QueryResult } from 'pg';
import moment from 'moment';
import { getDbClient } from '../config';

const removeSetting = async (userId: number) => {
    const params1 = [userId, moment().toISOString(true)];
    const query1 = `
        UPDATE setting 
        SET deleted_at=$2 
        WHERE user_id=$1 AND deleted_at IS NULL
        RETURNING setting.id
    `;
    const query2 = `
        UPDATE match 
        SET ended=true, ended_by=$1, ended_at=$2 
        WHERE (user_id_1=$1 OR user_id_2=$1) AND ended=false AND deleted_at IS NULL
        RETURNING user_id_1, user_id_2
    `;
    const query3 = `
        UPDATE embeddings 
        SET deleted_at=$2
        WHERE user_id=$1 AND deleted_at IS NULL
    `;
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        res = await client.query(query1, params1);
        const matchUpdateRes = await client.query(query2, params1);
        await client.query(query3, params1);
        if (matchUpdateRes.rows.length) {
            const query4 = `
                UPDATE setting 
                SET active_matches_count=active_matches_count-1
                WHERE user_id IN (
                    ${matchUpdateRes.rows.map((r, index) => '$' + (index + 1)).join(', ')}
                )
                AND deleted_at IS NULL
            `;
            const params4 = matchUpdateRes.rows.map(r => {
                return r.user_id_1 === userId ? r.user_id_2: r.user_id_1
            })
            await client.query(query4, params4);
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }   
    return Boolean(res?.rowCount);
}

export default removeSetting;