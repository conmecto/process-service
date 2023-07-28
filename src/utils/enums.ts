export enum Country {
    INDIA = 'india'
}

export enum Gender {
    MAN = 'man',
    WOMAN = 'woman',
    NON_BINARY = 'nonbinary'
}

export enum Search {
    MEN = 'men',
    WOMEN = 'women',
    EVERYONE = 'everyone'
}

export enum StatusCodes {
    OK = 200,
    CREATED = 201,

    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INVALID_TOKEN = 498,

    INTERNAL_SERVER = 500
}

export enum Errors {
    UNAUTHORIZED = 'Unauthorized',
    FORBIDDEN = 'Forbidden Resource',

    CITY_NOT_FOUND = 'City not found',
    USER_NOT_FOUND = 'User not found',

    INTERNAL_SERVER = 'Internal server error',
}

export enum ErrorCodes {
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',

    VALIDATION_ERROR = 'VALIDATION_ERROR',

    INTERNAL_SERVER = 'INTERNAL_SERVER',
}

export enum PrefixesForLogs {
    REDIS_SET_OBJECT = 'Redis set object error: ',
    REDIS_GET_USER = 'Redis get user error: ', 
    REDIS_GET_OBJECT = 'Redis get object error: ', 
    REDIS_CONNECTION_ERROR_CLIENT1 = 'Redis client 1 connection error: ',
    REDIS_CONNECTION_ERROR_CLIENT2 = 'Redis client 2 connection error: ',
    REDIS_CONNECTION_READY_CLIENT1 = 'Redis client 1 is ready: ',
    REDIS_CONNECTION_READY_CLIENT2 = 'Redis client 2 is ready: ',
    REDIS_PUBLISH_CHANNEL_ERROR = 'Redis publish channel error: ',
    REDIS_SUBSCRIBE_CHANNEL_ERROR = 'Redis subscribe channel error: ',
    REDIS_CHANNEL_MESSAGE_RECEIVE_ERROR = 'Redis channel message receive error: ',
    REDIS_PROCESS_MATCH_QUEUE_ERROR = 'Redis process match queue error',

    DB_CONNECTED = 'DB connection successful: ',
    DB_CONNECTION_FAILED = 'DB connection failed: ',
    
    EMAIL_SEND_ERROR = 'Email send error: '
}

export enum Messages {
}