import bcrypt from 'bcrypt';

import { generateToken, setCookie } from '../utils';

export async function login(_, { email, password }, ctx, info) {
  console.log(email, password);
  const seller = await ctx.prisma.seller.findOne({ where: { email } });
  if (!seller) {
    throw new Error('Could not find a match for email and password');
  }

  // const valid = await bcrypt.compare(password, seller.password);
  const valid = password === seller.password;
  if (!valid) {
    throw new Error('Could not find a match for email and password');
  }

  const token = generateToken({ sellerId: seller.id });
  setCookie(ctx.response, token);
  console.log('hreerngerj');

  return seller;
}

export async function signup(_, { email, name, password }, ctx, info) {
  const existing = await ctx.prisma.seller({ email: email });
  if (existing) {
    throw new Error(`User with email "${email}" already exists`);
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  const seller = await ctx.prisma.createSeller(
    { email, name, password: encryptedPassword },
    info
  );

  const token = generateToken({ sellerId: seller.id });
  setCookie(ctx.response, token);

  return seller;
}
