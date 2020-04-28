import { rule, shield, and, or, not, allow } from 'graphql-shield';
import { getUserId } from '../utils';
import { Context } from '../context';

const rules = {
  isSeller: rule()(async (_, args, context: Context) => {
    const sellerId = getUserId(context);
    const seller = await context.prisma.seller.findOne({
      where: { id: sellerId },
    });
    return Boolean(seller.id);
  }),

  // Check to see if seller is owner of store
  isStoreOwner: rule()(async (_, { storeId }, context: Context) => {
    const sellerId = getUserId(context);
    const seller = await context.prisma.store
      .findOne({
        where: {
          id: storeId,
        },
      })
      .seller();

    return sellerId === seller.id;
  }),
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
    addProduct: and(rules.isSeller, rules.isStoreOwner),
  },
});
