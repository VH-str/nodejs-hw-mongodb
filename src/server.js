import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';

import indexRouter from './routers/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const PORT = Number(getEnvVar('PORT', '3000'));

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(indexRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
