import express from 'express';
import sha256 from 'crypto-js/sha256';
import dayjs from 'dayjs';
import axios from 'axios';

import { Resp } from '../resp/resp';
import { server } from '../caddy/caddy';
import { colorlog } from '../utils/colorlog';
const routes = express.Router();

routes.get('/server', async (req, res) => {
  try {
    let result = await axios.get('http://localhost:2019/config/');
    console.log(result.data);
    let server: server = result.data;
    colorlog(JSON.stringify(server), 'info');
    res.json(server);
  } catch (error) {
    res.json({ ...Resp.fetchCaddyError, error });
  }
});

routes.post('/server', async (req, res) => {});

export { routes as caddy };
