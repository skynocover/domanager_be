import { Request, Response, NextFunction, Router } from 'express';
import { Resp } from '../resp/resp';

import { colorlog } from '../utils/colorlog';

export const checkSession = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    req.session.user = { id: 'user' };
  } else {
    colorlog(`session: ${JSON.stringify(req.session.user)}`, 'debug');
    if (!req.session.user) {
      res.clearCookie('user');
      res.json(Resp.backendCheckSessionFail);
      return;
    }
  }
  next();
};
