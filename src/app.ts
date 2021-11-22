import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { createServer } from './Infrastructures/http/create-server';
import container from './Infrastructures/inversify.config';

const start = async () => {
  const server = await createServer(container);
  await server.start();

  console.log(`server start at ${server.info.uri}`);
};

start();
