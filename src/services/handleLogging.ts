import { existsSync, writeFile, readFile, unlink } from 'fs';
import { join } from 'path';
import moment from 'moment';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config';
import { Environments, enums } from '../utils';

const handleLogging = async (error: string, channel: string) => {
  try {
    if (Environments.env !== 'prod') {
      return;
    }
    const date = moment().format('YYYY-MM-DD');
    const path = join(__dirname, '../../', `${date}.json`);
    if (existsSync(path)) {
      addLog(path, error);
    } else {
      removePrevLogFile();

      const data = {
        [moment().toISOString(true)]: error      
      };
      writeLog(path, JSON.stringify(data));
    }
  } catch(error) {
      console.log(enums.PrefixesForLogs.REDIS_CHANNEL_LOG_ERROR + error);
  }
}

const addLog = (filePath: string, log: string) => {
  readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.log(enums.PrefixesForLogs.LOG_FILE_ERROR + err);
    } else {
      const logs = JSON.parse(data);
      const timeStamp = moment().toISOString(true);
      logs[timeStamp] = log;
      const json = JSON.stringify(logs);
      writeLog(filePath, json);
    }
  });
}

const writeLog = (filePath: string, json: string) => {
  writeFile(filePath, json, { encoding: 'utf-8' }, (err) => {
    if (err) {
      console.log(enums.PrefixesForLogs.LOG_FILE_ERROR + err);
    }
  });
}

const removePrevLogFile = async () => {
  const date = moment().subtract(1, 'day').format('YYYY-MM-DD');
  const filePath = join(__dirname, '../../', `${date}.json`);
  if (!existsSync(filePath)) {
    return;
  }
  readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.log(enums.PrefixesForLogs.AWS_UPLOAD_LOG_FILE_ERROR + err);
    } else {
      const command = new PutObjectCommand({
        ACL: 'private',
        Bucket: Environments.aws.s3LogBucket,
        Key: `${date}.json`,
        Body: data
      });
      s3Client.send(command);
    }
  });
  unlink(filePath, (err) => {
    if (err) {
      console.log(enums.PrefixesForLogs.AWS_REMOVE_LOG_FILE_ERROR + err);
    }
  });
}

export default handleLogging;