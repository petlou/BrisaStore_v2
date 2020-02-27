import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import io from 'socket.io';
import http from 'http';

import cors from 'cors';

import routes from './routes';

import SentryConfig from './config/sentry';
import './database';

class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);

    Sentry.init(SentryConfig);

    this.socket();

    this.midlewares();
    this.routes();
    this.exceptionHandler();

    this.connectedUsers = {};
  }

  socket() {
    this.io = io(this.server);

    this.io.on('connection', socket => {
      const { user_id } = socket.handshake.query;
      this.connectedUsers[user_id] = socket.id;

      console.log(`[IO] Connection => Server has a new connection!`);
      console.log(`[Socket_ID] ${this.connectedUsers[user_id]}`);
      console.log(`[User_ID] ${user_id}`);
      // socket.on('chat.message', data => {
      //   console.log(data);
      //   this.io.emit('chat.message', data);
      // });

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
        console.log(`[IO] Disconnection => User disconected!`);
      });
    });
  }

  midlewares() {
    this.app.use(Sentry.Handlers.requestHandler());
    this.app.use(express.json());
    this.app.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.app.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
      })
    );
    this.app.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;

      next();
    });
  }

  routes() {
    this.app.use(routes);
    this.app.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.app.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV) {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
    });
  }
}

export default new App().server;
