import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';

import { init } from './db/db';
import { account } from './routes/account';
import { caddy } from './routes/server';
import { checkSession } from './middleware/checksession';

import { Config } from './utils/toml';

declare module 'express-session' {
  interface SessionData {
    user: { id: string };
  }
}

const app = express();

try {
  (async () => {
    init();
  })();
} catch (err) {
  console.error('Unable to connect to the database: ', err);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/api/version', (req, res) => {
  res.json({ env: process.env.NODE_ENV, version: Config().setting.version });
});

const admin = express.Router();
admin.use(
  session({
    secret: process.env.sessionKey || '618ce37383a17a9ba8007254f3a83f0a',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 60 * 60 * 1000 },
  }),
);
admin.use(account);

admin.use(checkSession, caddy);

app.use('/api', admin);

app.use(express.static('public'));
let server = app.listen(Config().setting.port, () => {
  console.log(new Date(), `env: ${process.env.NODE_ENV}`);
  console.log(new Date(), `version: ${Config().setting.version}`);
  console.log(new Date(), `server listening on ${Config().setting.port}`);
});
