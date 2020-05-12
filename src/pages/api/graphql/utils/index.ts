/* eslint-disable @typescript-eslint/camelcase */
import { v2 as cloudinary } from 'cloudinary';
import { verify, sign } from 'jsonwebtoken';
import { Context } from '../context';
import { ImageUploadError } from '../errors';

export const APP_SECRET = process.env.APP_SECRET;
const cloudinaryFolder = `${process.env.NODE_ENV}/uploads`;

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

export const readFS = (stream: {
  on: (
    arg0: string,
    arg1: (data: any) => number
  ) => { on: (arg0: string, arg1: () => void) => void };
}): Promise<Buffer> => {
  const chunkList: any[] | Uint8Array[] = [];
  return new Promise((resolve) =>
    stream
      .on('data', (data) => chunkList.push(data))
      .on('end', () => resolve(Buffer.concat(chunkList)))
  );
};

const cloundinaryUpload = (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: cloudinaryFolder,
        },
        (err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(`Upload succeed`);
            const { url } = res;
            resolve(url);
          }
        }
      )
      .end(buffer);
  });
};

export type FilePayload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: Function;
};

export type File = Promise<FilePayload>;

export async function uploadImage(file: File) {
  try {
    const { createReadStream } = await file;
    const stream = createReadStream();
    const buf = await readFS(stream);
    //TODO: validate image

    //upload image
    const res = await cloundinaryUpload(buf);

    return res;
  } catch (err) {
    console.log(err);
    throw new ImageUploadError();
  }
}
