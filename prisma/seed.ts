import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialProducts = [
  {
    id: 'firstprod',
    name: 't-shirt',
    description: 'my shirt',
    price: 10.0,
  },
];

const initialSeller = {
  id: 'seller1',
  name: 'Diondre Edwards',
  email: 'test@test.com',
  password: 'testing',
};

const initialStore = {
  id: 'store1',
  name: 'GOT Store',
  key: 'gotstore',
  // sellerId: 'seller1',
};

async function main() {
  // Add Seller
  const sellerRes = await prisma.seller.create({ data: initialSeller });

  // Add store
  const storeRes = await prisma.store.create({
    data: { ...initialStore, seller: { connect: sellerRes } },
  });

  // Add products to store
  await Promise.all(
    initialProducts.map((product) =>
      prisma.product.create({
        data: { ...product, store: { connect: storeRes } },
      })
    )
  );
}

main().catch((e) => console.error(e));
