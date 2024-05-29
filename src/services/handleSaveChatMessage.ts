import { enums } from '../utils';
import saveChatMessage from './saveChatMessage';
import updateMatchScore from './updateMatchScore';
import logger from './logger';

const handleSaveChatMessage = async (data: any, channel: string) => {
    try {
        const { message, userId, matchedUserId, matchId, event, fileData } = JSON.parse(data);
        const sender = Number(userId);
        const receiver = Number(matchedUserId);
        const matchIdNum = Number(matchId);
        await Promise.all([
            saveChatMessage({ sender, receiver, message, matchId: matchIdNum, event, fileData }),
            updateMatchScore(matchIdNum, sender, receiver, event === enums.ChatSocketEvents.SAVE_FILE)
        ]);
    } catch(error) {
        await logger('Process Service: ' + enums.PrefixesForLogs.REDIS_CHANNEL_SAVE_MESSAGE_ERROR + error?.toString());
    }
}

export default handleSaveChatMessage;