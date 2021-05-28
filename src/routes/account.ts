import express from 'express';
import sha256 from 'crypto-js/sha256';
import dayjs from 'dayjs';

import { Resp } from '../resp/resp';
import { prisma } from '../db/db';

const routes = express.Router();

routes.post('/login', async (req, res) => {
  let { account, password } = req.body;

  const user = await prisma.user.findUnique({ where: { id: account } });
  if (!user || user.password !== password) {
    res.json(Resp.accountAuthFailure);
    return;
  }

  let sign = { id: account };
  req.session.user = sign;
  res.cookie('user', JSON.stringify(sign), {
    httpOnly: false,
    expires: dayjs().add(1, 'hour').toDate(),
  });
  res.status(200).json(Resp.success);
});

routes.post('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('user');
    res.status(200).json(Resp.success);
  });
});

routes.get('/redirect', async (req, res) => {
  res.status(200).json(Resp.success);
});

export { routes as account };
