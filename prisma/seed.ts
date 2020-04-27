import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialProducts = [
  {
    id: 'firstprod',
    name: 't-shirt',
    description: 'my shirt',
    price: 20.0,
  },
  {
    id: 'secondprod',
    name: 'Old Brigand Rum',
    description: 'Bottle of brown rum',
    price: 15.0,
  },
  {
    id: 'thirdprod',
    name: 'Coconut Cream',
    description: 'Coconut cream ideal for mixing pina coladas',
    price: 5.5,
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
};

async function main() {
  // Add Seller
  const sellerRes = await prisma.seller.create({ data: initialSeller });

  // Add store
  const storeRes = await prisma.store.create({
    data: { ...initialStore, seller: { connect: { id: sellerRes.id } } },
  });

  // Add products to store
  await Promise.all(
    initialProducts.map((product) =>
      prisma.product.create({
        data: { ...product, store: { connect: { id: storeRes.id } } },
      })
    )
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.disconnect();
  });
