import { nexusPrismaPlugin } from 'nexus-prisma';
import { makeSchema, objectType, stringArg } from '@nexus/schema';
import { join } from 'path';
import { Mutation } from './mutations';

const Seller = objectType({
  name: 'Seller',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.store();
    t.model.membership();
  },
});

const Membership = objectType({
  name: 'Membership',
  definition(t) {
    t.model.id();
    t.model.description();
    t.model.price();
  },
});

const SellerMembership = objectType({
  name: 'SellerMembership',
  definition(t) {
    t.model.id();
    t.model.seller();
    t.model.active();
  },
});

const Product = objectType({
  name: 'Product',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.price();
    t.model.store();
  },
});

const Store = objectType({
  name: 'Store',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.biography();
    t.model.key();
    t.model.products();
    t.model.logo();
    t.model.coverImage();
    t.model.seller();
    t.model.active();
  },
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.username();
    t.model.email();
    t.model.name();
    t.model.password();
  },
});

const SellerAuthPayload = objectType({
  name: 'SellerAuthPayload',
  definition(t) {
    t.string('token');
    t.field('seller', { type: 'Seller' });
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.sellers();
    // t.crud.products();
    // t.crud.users();

    t.list.field('products', {
      type: 'Product',
      resolve: (_parent, _args, ctx) => {
        return ctx.prisma.product.findMany({
          where: { published: true },
        });
      },
    });

    t.list.field('stores', {
      type: 'Store',
      resolve: (_parent, _args, ctx) => {
        return ctx.prisma.store.findMany({
          where: { active: true },
        });
      },
    });

    t.list.field('searchProducts', {
      type: 'Product',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (_parent, { searchString }, ctx) => {
        return ctx.prisma.product.findMany({
          where: {
            published: true,
            OR: [
              {
                name: {
                  contains: searchString,
                },
              },
              {
                description: {
                  contains: searchString,
                },
              },
            ],
          },
        });
      },
    });
  },
});

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Product,
    Store,
    Seller,
    SellerMembership,
    Membership,
    User,
    SellerAuthPayload,
  ],
  plugins: [nexusPrismaPlugin()],
  shouldGenerateArtifacts: !Boolean(process.env.NODE_ENV),
  outputs: {
    schema: join(__dirname, '/schema.graphql'),
    typegen: join(__dirname, '/generated/nexus-typegen.ts'),
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./context.ts'),
        alias: 'Context',
      },
    ],
  },
});
