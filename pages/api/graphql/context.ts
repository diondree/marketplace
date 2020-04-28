import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export type UserObj = { loggedIn: boolean; token: string };

export interface Context {
  prisma: PrismaClient;
  request?: any;
  response?: any;
}

export function createContext({ req, res }): Context {
  return { prisma, request: req, response: res };
}
