import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import cors from 'cors';

import routes from './routes';

import SentryConfig from './config/sentry';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(SentryConfig);

    this.midlewares();
    this.routes();
    this.exceptionHandler();
  }

  midlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(
      cors({
        origin: [
          'http://localhost:3000',
          'http://localhost:8080',
          'http://10.1.4.20:3000',
          'http://10.1.4.20:8080',
        ],
        credentials: true,
      })
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV) {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
    });
  }
}

export default new App().server;
