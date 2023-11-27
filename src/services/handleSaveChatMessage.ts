import { Environments, enums } from '../utils';
import saveChatMessage from './saveChatMessage';
import updateMatchScore from './updateMatchScore';

const handleSaveChatMessage = async (data: any, channel: string) => {
  try {
      const { message, userId, matchedUserId, matchId } = JSON.parse(data);
      const sender = Number(userId);
      const receiver = Number(matchedUserId);
      const matchIdNum = Number(matchId);
      await Promise.all([
        saveChatMessage({ sender, receiver, message, matchId: matchIdNum }),
        updateMatchScore(matchIdNum, sender, receiver)
      ]);
  } catch(error) {
      console.log(enums.PrefixesForLogs.REDIS_CHANNEL_SAVE_MESSAGE_ERROR + error);
  }
}

export default handleSaveChatMessage;