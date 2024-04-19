import pg, { Pool, PoolClient } from 'pg';
import pgvector from 'pgvector/pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Environments, constants, enums } from '../utils';
import { CustomError } from '../services';

const pool = new Pool({
    host: Environments.database.host,
    port: Environments.database.port,
    user: Environments.database.username,
    password: Environments.database.password,
    database: Environments.database.database,
    max: constants.DB_MAX_CLIENTS,
    idleTimeoutMillis: constants.DB_IDLE_TIMEOUT_MILLIS,
    connectionTimeoutMillis: constants.DB_CONNECTION_TIMEOUT_MILLIS,
    ...(Environments.env === 'prod' ? {
        ssl: {
            rejectUnauthorized: true,
            ca: readFileSync(join(__dirname, '..', '..', '/2', '/key.pem'))?.toString()
        }
    } : (
        Environments.env === 'test' ? 
        {
            ssl: {
                rejectUnauthorized: false
            }
        } : {}
    )
    )
});

const timestampzOid = 1184;
pg.types.setTypeParser(timestampzOid, function (value) {
    return value === null ? null : new Date(value);
});

pool.on('error', (err, client) => {
    console.error(enums.PrefixesForLogs.DB_CONNECTION_FAILED + err);
});

pool.on('connect', async function (client) {
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    await pgvector.registerType(client);
});

const getDbClient = async (): Promise<PoolClient> => {
    const client = await pool.connect();
    if (!client) {
        // maybe add retry functionality 
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    return client;
}

export default getDbClient;
