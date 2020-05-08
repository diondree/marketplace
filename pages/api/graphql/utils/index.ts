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
  //validate image
  throw new InvalidImageError();

  //upload image
  return cloudinary.uploader.upload(imagePath, function (error, result) {
    console.log(result, error);
    return new ImageUploadError(error);
  });
}
