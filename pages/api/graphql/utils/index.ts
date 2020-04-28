import { verify, sign } from 'jsonwebtoken';
import { Context } from '../context';

export const APP_SECRET = process.env.APP_SECRET;

export function generateToken(payload) {
  return sign(payload, APP_SECRET);
}

export function setCookie(response, token) {
  console.log(response);
  response.cookie('token', `Bearer ${token}`, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });
}

interface Token {
  sellerId: string;
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const verifiedToken = verify(token, APP_SECRET) as Token;
    return verifiedToken && verifiedToken.sellerId;
  }
}
