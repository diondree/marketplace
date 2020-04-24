import { nexusPrismaPlugin } from 'nexus-prisma';
import {
  intArg,
  makeSchema,
  objectType,
  stringArg,
  asNexusMethod,
} from '@nexus/schema';
import { createContext } from './types';
import { join } from 'path';

const Seller = objectType({
  name: 'Seller',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    // t.model.password();
  },
});

const SellerMembership = objectType({
  name: 'SellerMembership',
  definition(t) {
    t.model.id();
    // t.model.seller({
    //   pagination: false,
    // });
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
    t.model.key();
    t.model.products();
    t.model.seller();
    // t.model.author();
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    // t.crud.post();

    t.list.field('products', {
      type: 'Product',
      resolve: (_parent, _args, ctx) => {
        return ctx.prisma.product.findMany({
          where: { published: true },
        });
      },
    });
  },
});

// const Mutation = objectType({
//   name: 'Mutation',
//   definition(t) {
//     t.crud.createOneUser({ alias: 'signupUser' });
//     t.crud.deleteOnePost();

//     t.field('createDraft', {
//       type: 'Post',
//       args: {
//         title: stringArg({ nullable: false }),
//         content: stringArg(),
//         authorEmail: stringArg(),
//       },
//       resolve: (_, { title, content, authorEmail }, ctx) => {
//         return ctx.prisma.post.create({
//           data: {
//             title,
//             content,
//             published: false,
//             author: {
//               connect: { email: authorEmail },
//             },
//           },
//         });
//       },
//     });

//     t.field('publish', {
//       type: 'Post',
//       nullable: true,
//       args: {
//         id: intArg(),
//       },
//       resolve: (_, { id }, ctx) => {
//         return ctx.prisma.post.update({
//           where: { id: Number(id) },
//           data: { published: true },
//         });
//       },
//     });
//   },
// });

export const schema = makeSchema({
  types: [Query, Product, Store, Seller, SellerMembership],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    typegen: join(__dirname, '/generated/nexus-typegen.ts'),
    schema: join(__dirname, '/schema.graphql'),
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: join(__dirname, 'types.ts'),
        alias: 'Context',
      },
    ],
  },
});
