import path from 'path';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const init = async () => {
  const user = await prisma.user.findFirst({ where: { id: 'admin' } });

  if (!user) {
    await prisma.user.create({ data: { id: 'admin', password: '123456' } });
  }
};
