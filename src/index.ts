import express from 'express';

import { start } from '@/server';
import { CheckDbConnection } from '@/dbConnection';
import { config } from '@/config';

const initializeServer = (): void => {
  config.cloudinaryConfig();
  const app = express();
  CheckDbConnection()
  start(app);
};

initializeServer();



