import { helpers, interfaces } from '../utils';
import addSetting from './addSetting';
import addUserInMatchQueue from './addUserInMatchQueue';

const handleAddSettingsMessage = async (payload: any) => {
    const { id: userId, country } = payload;
    const res = await addSetting(userId, country);
    if (!res) {
        throw new Error('Add Setting Failed');
    }
    await addUserInMatchQueue(userId);
    return res;
}

export default handleAddSettingsMessage;