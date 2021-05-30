import express from 'express';
import sha256 from 'crypto-js/sha256';
import dayjs from 'dayjs';
import axios from 'axios';

import { Resp } from '../resp/resp';
import { server } from '../caddy/caddy';
import { colorlog } from '../utils/colorlog';
import { prisma } from '../db/db';
import { col } from 'sequelize/types';
const routes = express.Router();

routes.get('/servers', async (req, res) => {
  try {
    let servers = await prisma.server.findMany({
      include: {
        handlers: true,
      },
    });

    // colorlog(JSON.stringify(server), 'info');
    res.json({ ...Resp.success, servers });
  } catch (error) {
    res.json({ ...Resp.fetchCaddyError, error });
  }
});

routes.put('/servers', async (req, res) => {
  try {
    let { servers } = req.body;
    // colorlog(`servers: ${JSON.stringify(servers)}`, 'info');
    let caddyFile = '';
    let serverIDs: number[] = []; //要被刪除的serverID
    let handlerIDs: number[] = []; //要被刪除的handlerID
    for (const server of servers) {
      serverIDs.push(server.id);
      let instance: any = {
        id: server.id,
        name: server.name,
        domain: server.domain,
        port: server.port,
      };

      colorlog('1st', 'debug');
      let fserver = await prisma.server.upsert({
        where: { id: server.id },
        update: instance,
        create: instance,
      });
      caddyFile += `${server.domain ? server.domain : ''}:${server.port} {\n`;

      colorlog('2nd', 'debug');
      for (const handler of server.handlers) {
        handlerIDs.push(handler.id);
        let iHandler: any = {
          serverId: server.id,
          id: handler.id,
          type: handler.type,
          routes: handler.routes,
          target: handler.target,
        };
        await prisma.handler.upsert({
          where: { id: handler.id },
          update: iHandler,
          create: iHandler,
        });
        colorlog('3rd', 'debug');
        caddyFile += `${handler.type === 'proxy' ? 'reverse_proxy ' : 'root '}${
          handler.routes ? handler.routes + ' ' : ''
        }${handler.target}\n`;
        if (handler.type === 'file_server') {
          caddyFile += `file_server\n`;
        }
      }
      caddyFile += `}\n`;
    }

    caddyFile += `
    ${process.env.DOMAIN}:80 {
      reverse_proxy /api/* localhost:${process.env.BEPORT}
      reverse_proxy localhost:${process.env.FEPORT}
    }
    `;

    await prisma.handler.deleteMany({
      where: {
        id: {
          notIn: handlerIDs,
        },
      },
    });

    colorlog('4th', 'debug');
    await prisma.server.deleteMany({
      where: {
        id: {
          notIn: serverIDs,
        },
      },
    });

    colorlog(caddyFile, 'info');

    let result = await axios.post('http://localhost:2019/load', caddyFile, {
      headers: { 'Content-Type': 'text/caddyfile' },
    });

    colorlog('5th', 'debug');
    res.json(Resp.success);
  } catch (error) {
    res.json({ ...Resp.putCaddyError, error });
  }
});

export { routes as caddy };
