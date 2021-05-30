import axios from 'axios';
import { parse, stringify } from 'flatted';

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
    let url = `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONEID}/dns_records?type=A&content=34.80.252.93&proxied=true&order=name&direction=desc&match=all`;
    colorlog(url, 'info');
    let response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        // 'X-Auth-Email': 'cd83207153@gmail.com',
        // 'X-Auth-Key': process.env.CLOUDFLARE_KEY,
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    });

    // let response = await axios.get('https://api.cloudflare.com/client/v4/user/tokens/verify', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer lYlF_3CCexSv3MomIdddRkYZUhvLNYPVz0BDuLVr',
    //   },
    // });

    colorlog(`dns record: ${JSON.stringify(response.data)}`, 'info');

    url = `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONEID}/dns_records`;
    response = await axios.post(
      url,
      {
        type: 'A',
        name: 'aaa.credot.ml',
        content: '34.80.252.93',
        ttl: 1,
        priority: 10,
        proxied: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
          'X-Auth-Email': 'cd83207153@gmail.com',
          'X-Auth-Key': process.env.CLOUDFLARE_KEY,
        },
      },
    );
    colorlog(`dns record post: ${JSON.stringify(response.data)}`, 'info');
    // let servers = await prisma.server.findMany({
    //   include: {
    //     handlers: true,
    //   },
    // });
    // colorlog(JSON.stringify(servers));
  } catch (error) {
    colorlog(`init fail: ${error}`, 'error');
  }
};
