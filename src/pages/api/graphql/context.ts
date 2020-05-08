import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
export type UserObj = { loggedIn: boolean; token: string };

export interface Context {
  prisma: PrismaClient;
  request?: NextApiRequest;
  response?: NextApiResponse;
}

export type contextPayload = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export function createContext({ req, res }: contextPayload): Context {
  return {
    prisma,
    request: req,
    response: res,
  };
}
