import { prisma } from '../db/db';
import { colorlog } from '../utils/colorlog';

export interface server {
  apps: {
    http: {
      servers: {
        [key: string]: srv;
      };
    };
  };
}

export interface srv {
  listen: string[];
  routes: route[];
}

export interface route {
  handle: handle[];
  match?: match[];
  terminal?: boolean;
}

export interface match {
  host?: string[];
  path?: string[];
}

export interface handle {
  body?: string;
  handler: string;
  root?: string;
  hide?: string[];
  routes?: route[];
  upstreams?: {
    dial: string;
  }[];
}

export const init = async () => {
  try {
    let servers = await prisma.server.findMany({
      select: {
        id: true,
        name: true,
        domain: true,
        port: true,
        proxy: {
          select: {
            id: true,
            routes: true,
            target: true,
          },
        },
        staticFile: {
          select: {
            id: true,
            routes: true,
            target: true,
          },
        },
        staticResponse: {
          select: {
            id: true,
            body: true,
          },
        },
      },
    });
    colorlog(JSON.stringify(servers));
  } catch (error) {
    colorlog(`read db fail: ${error}`, 'error');
  }
};
