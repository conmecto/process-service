const getRandomNumberMinMax = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max-min+1) + min);
}

const formatDbQueryKey = (key: string) => {
    const keyWithoutUnderScore = key.split('_').map(c => c[0].toUpperCase() + c.substring(1)).join('');
    return keyWithoutUnderScore[0].toLowerCase() + keyWithoutUnderScore.substring(1);
}

function formatDbQueryResponse<T extends Object>(dbQueryResponse: Record<string, any>) {
    const formatedResponse: T = {} as T;
    for(let key of Object.keys(dbQueryResponse)) {
        const formatedKey = formatDbQueryKey(key); 
        formatedResponse[formatedKey] = dbQueryResponse[key];
    }
    return formatedResponse;
}

const getAge = (date: string): number => {
    const dob = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

export { getRandomNumberMinMax, formatDbQueryKey, formatDbQueryResponse, getAge } 