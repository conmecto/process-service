import { helpers, interfaces } from '../utils';
import addSetting from './addSetting';
import addUserInMatchQueue from './addUserInMatchQueue';

const handleAddSettingsMessage = async (payload: any) => {
    const { dob, id: userId, gender, country, searchFor } = payload;
    const age = helpers.getAge(dob);
    const settingDoc = { 
        age, 
        gender, 
        maxSearchAge: age + (age < 70 ? 1 : 0), 
        minSearchAge: age + (age > 18 ? -1 : 0), 
        searchFor, 
        userId 
    };
    const locationDoc: interfaces.ICreateLocationSettingObject = {
        country,
        userId,
    }
    const res = await addSetting(settingDoc, locationDoc);
    if (!res) {
        throw new Error('Add Setting Failed');
    }
    await addUserInMatchQueue(userId);
    return res;
}

export default handleAddSettingsMessage;