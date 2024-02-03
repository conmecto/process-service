import { createServer } from 'http';
import { Environments } from './utils';
import { runRedisFile, runAwsFile } from './config';

const server = createServer();

server.listen(Environments.server.port, 
    () => console.log(`Server is running on port: ${Environments.server.port}`)
);

runRedisFile();

if (Environments.env === 'prod') {
    runAwsFile();
}
