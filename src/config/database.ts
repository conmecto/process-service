import { Pool, PoolClient } from 'pg';
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
