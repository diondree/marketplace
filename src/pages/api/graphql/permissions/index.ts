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

  isUnauthenticated: rule()(async (_, args, context: Context) => {
    const sellerId = getUserId(context);

    return !sellerId;
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
    searchProducts: allow,
    products: allow,
    stores: allow,
  },
  Mutation: {
    sellerLogin: rules.isUnauthenticated,
    sellerSignup: rules.isUnauthenticated,
    createStore: rules.isSeller,
    editStore: rules.isStoreOwner,
    addProduct: and(rules.isSeller, rules.isStoreOwner),
    editProduct: and(rules.isSeller, rules.isStoreOwner),
  },
});
