import pg, { Pool, PoolClient } from 'pg';
import { readFileSync } from 'fs';
import { Environments, constants, enums } from '../utils';
import { CustomError } from '../services';

const timestampzOid = 1184;
pg.types.setTypeParser(timestampzOid, function (value) {
  return value
});

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
                ca: readFileSync('./key.pem')
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

pool.on('error', (err, client) => {
    console.error(enums.PrefixesForLogs.DB_CONNECTION_FAILED + err);
})

pool.on('connect', () => {
    console.error(enums.PrefixesForLogs.DB_CONNECTED);
})

const getDbClient = async (): Promise<PoolClient> => {
    const client = await pool.connect();
    if (!client) {
        // maybe add retry functionality 
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    return client;
}

export default getDbClient;
