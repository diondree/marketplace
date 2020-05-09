import { v2 as cloudinary } from 'cloudinary';
import { verify, sign } from 'jsonwebtoken';
import { Context } from '../context';
import { ImageUploadError, InvalidImageError } from '../errors';

export const APP_SECRET = process.env.APP_SECRET;

export function generateToken(payload) {
  return sign(payload, APP_SECRET);
}

interface Token {
  sellerId: string;
}

export function getUserId(context: Context) {
  const Authorization = context.request.headers.authorization;
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const verifiedToken = verify(token, APP_SECRET) as Token;
    return verifiedToken && verifiedToken.sellerId;
  }
}

export async function uploadImage(imagePath) {
  try {
    //validate image

    console.log('!<---->!');
    //upload image
    const res = await cloudinary.uploader.upload(imagePath);

    console.log('<---->');
    console.log(res);
    console.log('<---->');
    return res;
  } catch (err) {
    console.log(err);
    throw new ImageUploadError();
  }
}
