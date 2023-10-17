import { Environments, enums } from '../utils';
import saveChatMessage from './saveChatMessage';

const handleSaveChatMessage = async (data: any, channel: string) => {
  try {
      const { message, userId, matchedUserId, matchId } = JSON.parse(data);
      await saveChatMessage({ sender: Number(userId), receiver: Number(matchedUserId), message, matchId: Number(matchId) });
  } catch(error) {
      console.log(enums.PrefixesForLogs.REDIS_CHANNEL_SAVE_MESSAGE_ERROR + error);
  }
}

export default handleSaveChatMessage;