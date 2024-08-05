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

export enum SearchArea {
    CLOSE = 'close',
    MID = 'mid',
    DISTANT = 'distant'
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
    AWS_CHECK_BUCKET_ERROR = 'AWS check bucket error: ',
    AWS_CREATE_BUCKET_ERROR = 'AWS create bucket error: ',
    AWS_UPLOAD_LOG_FILE_ERROR = 'AWS upload log file error: ', 
    AWS_REMOVE_LOG_FILE_ERROR = 'AWS remove log file error: ',   
    LOG_FILE_ERROR = 'Log file error: ',
    
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
    REDIS_PROCESS_MATCH_QUEUE_ERROR = 'Redis process match queue error: ',
    REDIS_CHANNEL_SAVE_MESSAGE_ERROR = 'Redis save chat message error: ',
    REDIS_CHANNEL_LOG_ERROR = 'Redis channel log error: ',
    REDIS_LOGGING_CHANNEL_ERROR = 'Redis logging channel error: ',
    REDIS_CHANNEL_ACCOUNT_REMOVED_MESSAGE_ERROR = 'Redis channel account removed message error: ',
    REDIS_ADD_USER_IN_MATCH_QUEUE_ERROR = 'Redis add user in match queue error: ',

    DB_CONNECTED = 'DB connection successful: ',
    DB_CONNECTION_FAILED = 'DB connection failed: ',
    DB_GET_MATCH_SETTING_ERROR = 'DB get match setting error: ',
    DB_CREATE_POSSIBLE_MATCH_ERROR = 'DB create possible match error: ',
    DB_CHECK_USER_MATCH_ERROR = 'DB check user match error: ',
    DB_SAVE_CHAT_MESSAGE_ERROR = 'DB save chat message error: ',
    DB_UPDATE_MATCH_SCORE_ERROR = 'DB update match score error: ',
    DB_CHECK_USER_MATCH_POSSIBLE = 'DB check user match possible error: ',

    FIND_MAX_SIZE_QUEUE_ERROR = 'Find max size queue error: ',
    
    EMAIL_SEND_ERROR = 'Email send error: '
}

export enum Messages {
    MATCH_QUEUE_UPDATED = 'Match queue updated',
}

export enum ChatSocketEvents {
    SAVE_MESSAGE = 'save-message',
    SAVE_FILE = 'save-file',
    MARK_MESSAGES_AS_READ = 'mark-messages-as-read',
    MESSAGE_RECEIVED = 'message-received'
}