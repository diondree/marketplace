import { rule, shield, and, or, not, allow } from 'graphql-shield';
import { getUserId } from '../utils';

const rules = {
  isSeller: rule()(async (_, args, context) => {
    const sellerId = getUserId(context);
    console.log('called');
    const seller = await context.prisma.sellers.findOne({
      where: { id: sellerId },
    });
    return Boolean(seller.data.id);
  }),

  // Check to see if seller is owner of store

  // isProductOwner: rule()(async (parent, { id }, context) => {
  //   const userId = getUserId(context);
  //   const author = await context.prisma.product
  //     .findOne({
  //       where: {
  //         id,
  //       },
  //     })
  //     .author();
  //   return userId === author.id;
  // }),
};

export const permissions = shield({
  Query: {
    // '*': allow,
    products: allow,
    stores: allow,
  },
  Mutation: {
    // '*': allow,
    sellerLogin: allow,
    sellerSignup: rules.isSeller,
    addProduct: rules.isSeller,
  },
});
