const DB_CONNECTION_TIMEOUT_MILLIS = 10000;
const DB_MAX_CLIENTS = 20;
const DB_IDLE_TIMEOUT_MILLIS = 30000;

const MIN_MAX_AGE_DIFF = 2; 

const PROCESS_MATCH_QUEUE_CALL_BUFFER_TIME_MILLIS = 300000;

const CHECK_USER_MATCHED_KEY = 'match:userId:';

const GenderSearchForCombinations = {
    man: {
        women: "gender='woman' AND (search_for='men' OR search_for='everyone')",
        men: "gender='man' AND (search_for='men' OR search_for='everyone')",
        everyone: "(search_for='men' OR search_for='everyone')"
    }, 
    woman: {
        women: "gender='woman' AND (search_for='women' OR search_for='everyone')",
        men: "gender='man' AND (search_for='women' OR search_for='everyone')",
        everyone: "(search_for='women' OR search_for='everyone')"
    },
    nonbinary: { 
        women: "gender='nonbinary'",
        men: "gender='nonbinary'",
        everyone: "gender='nonbinary'",
    },
    'n/s': { 
        women: "gender='n/s'",
        men: "gender='n/s'",
        everyone: "gender='n/s'",
    }
}

export {
    DB_CONNECTION_TIMEOUT_MILLIS, DB_MAX_CLIENTS, DB_IDLE_TIMEOUT_MILLIS, CHECK_USER_MATCHED_KEY, MIN_MAX_AGE_DIFF,
    GenderSearchForCombinations, PROCESS_MATCH_QUEUE_CALL_BUFFER_TIME_MILLIS
}