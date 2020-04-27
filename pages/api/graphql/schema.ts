import { nexusPrismaPlugin } from 'nexus-prisma';
import { makeSchema, objectType, stringArg, floatArg } from '@nexus/schema';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// schema.objectType({
//   name: 'User',
//   definition(t) {
//     t.int('id', { description: 'Id of the user' })
//     t.string('fullName', { description: 'Full name of the user' })
//     t.list.field('posts', {
//       type: 'Post',
//       resolve(post, args, ctx) {
//         return ctx.db.user.getOne(post.id).posts()
//       },
//     })
//   },
// })
const Seller = objectType({
  name: 'Seller',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.store();
  },
});

const SellerMembership = objectType({
  name: 'SellerMembership',
  definition(t) {
    t.model.id();
    t.model.seller();
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
    t.model.active();
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.products();
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

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.crud.createOneUser({ alias: 'signupUser' });

    t.field('addProduct', {
      type: 'Product',
      args: {
        name: stringArg({ nullable: false }),
        description: stringArg(),
        images: stringArg({ list: true }),
        price: floatArg(),
        storeId: stringArg({ nullable: false }),
      },
      resolve: (_, { name, description, price, storeId, images }, ctx) => {
        return ctx.prisma.product.create({
          data: {
            id: uuidv4(),
            name,
            description,
            images,
            price,
            store: {
              connect: { id: storeId },
            },
          },
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
  types: [Query, Mutation, Product, Store, Seller, SellerMembership],
  plugins: [nexusPrismaPlugin()],
  shouldGenerateArtifacts: false,
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
        source: join(__dirname, 'context.ts'),
        alias: 'Context',
      },
    ],
  },
});
