import { objectType, stringArg, floatArg, booleanArg } from '@nexus/schema';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import validator from 'validator';

import { generateToken, getUserId } from '../utils';
import { Product } from '@prisma/client';
import { DuplicateEmailError, InvalidEmailError } from '../errors';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('addProduct', {
      type: 'Product',
      args: {
        name: stringArg({ nullable: false }),
        description: stringArg(),
        featuredImage: stringArg(),
        images: stringArg({ list: true }),
        price: floatArg(),
        storeId: stringArg({ nullable: false }),
      },
      resolve: (
        _,
        {
          name,
          description,
          price,
          storeId,
          images = [],
          featuredImage,
        }: Product,
        ctx
      ) => {
        return ctx.prisma.product.create({
          data: {
            id: uuidv4(),
            name,
            description,
            featuredImage,
            images: { set: images },
            price,
            store: {
              connect: { id: storeId },
            },
          },
        });
      },
    });

    t.field('editProduct', {
      type: 'Product',
      args: {
        id: stringArg({ nullable: false }),
        name: stringArg(),
        description: stringArg(),
        price: floatArg(),
        published: booleanArg(),
        images: stringArg({ list: true }),
        featuredImage: stringArg(),
      },
      resolve: (
        _,
        { id, name, description, price, published, images = [], featuredImage },
        ctx
      ) => {
        return ctx.prisma.product.update({
          where: {
            id,
          },
          data: {
            name,
            description,
            price,
            published,
            images: {
              set: images,
            },
            featuredImage,
          },
        });
      },
    });

    t.field('createStore', {
      type: 'Store',
      args: {
        name: stringArg({ nullable: false }),
        key: stringArg(),
        biography: stringArg(),
      },
      resolve: (_, { name, key, biography }, ctx) => {
        return ctx.prisma.store.create({
          data: {
            id: uuidv4(),
            name,
            key,
            biography,
            seller: {
              connect: {
                id: getUserId(ctx),
              },
            },
          },
        });
      },
    });

    t.field('editStore', {
      type: 'Store',
      args: {
        id: stringArg({ nullable: false }),
        name: stringArg(),
        biography: stringArg(),
        key: stringArg(),
      },
      resolve: (_, { id, name, biography, key }, ctx) => {
        return ctx.prisma.store.update({
          where: {
            id,
          },
          data: {
            name,
            biography,
            key,
          },
        });
      },
    });

    t.field('sellerSignup', {
      type: 'SellerAuthPayload',
      args: {
        name: stringArg({ nullable: false }),
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_, { email, name, password }, ctx) => {
        if (!validator.isEmail(email)) {
          return new InvalidEmailError();
        }
        const existing = await ctx.prisma.seller.findOne({ where: { email } });
        if (existing) {
          return new DuplicateEmailError();
        }

        const encryptedPassword = await hash(password, 10);
        const seller = await ctx.prisma.seller.create({
          data: {
            id: uuidv4(),
            email,
            name,
            password: encryptedPassword,
          },
        });

        const token = generateToken({ sellerId: seller.id });

        return { seller, token };
      },
    });

    t.field('sellerLogin', {
      type: 'SellerAuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_, { email, password }, ctx) => {
        const seller = await ctx.prisma.seller.findOne({ where: { email } });
        if (!seller) {
          throw new Error('Could not find a match for email and password');
        }

        const valid = await compare(password, seller.password);
        // const valid = password === seller.password;
        if (!valid) {
          throw new Error('Could not find a match for email and password');
        }

        const token = generateToken({ sellerId: seller.id });

        return { seller, token };
      },
    });
  },
});

// export async function signup
