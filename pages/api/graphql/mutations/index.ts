import { objectType, stringArg, floatArg } from '@nexus/schema';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';

import { generateToken } from '../utils';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    // t.crud.createOneUser({ alias: 'signupUser' });

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
        { name, description, price, storeId, images, featuredImage },
        ctx
      ) => {
        return ctx.prisma.product.create({
          data: {
            id: uuidv4(),
            name,
            description,
            featuredImage,
            images,
            price,
            store: {
              connect: { id: storeId },
            },
          },
        });
      },
    });

    t.field('createStore', {
      type: 'Store',
      args: {
        name: stringArg({ nullable: false }),
        key: stringArg(),
        sellerId: stringArg(),
        biography: stringArg(),
      },
      resolve: (_, { name, key, sellerId, biography }, ctx) => {
        return ctx.prisma.store.create({
          data: {
            id: uuidv4(),
            name,
            key,
            biography,
            seller: {
              connect: {
                id: sellerId,
              },
            },
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
        const existing = await ctx.prisma.seller.findOne({ where: { email } });
        if (existing) {
          throw new Error(`User with email "${email}" already exists`);
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
        console.log(email, password);
        const seller = await ctx.prisma.seller.findOne({ where: { email } });
        if (!seller) {
          throw new Error('Could not find a match for email and password');
        }

        // const valid = await compare(password, seller.password);
        const valid = password === seller.password;
        if (!valid) {
          throw new Error('Could not find a match for email and password');
        }

        const token = generateToken({ sellerId: seller.id });
        // setCookie(ctx.response, token);
        console.log(token);

        return { seller, token };
      },
    });

    // t.field('registerUser', {
    //   type: 'User',
    //   args: {

    //   }
    // })
  },
});

// export async function signup
