//import express, { Express, urlencoded, json } from 'express';
import { createServer } from 'http';
import { Environments, constants } from './utils';
//import router from './routes';
import { errorHandler } from './middlewares/errorHandling';

const server = createServer();

server.listen(Environments.server.port, 
    () => console.log(`Server is running on port: ${Environments.server.port}`)
);