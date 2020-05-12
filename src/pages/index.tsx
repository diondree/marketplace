import { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import gql from 'graphql-tag';
// import { useQuery } from 'react-apollo';
import { Product } from '@prisma/client';

const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      description
      price
      images
    }
  }
`;

declare interface NextPageProps {
  data: {
    products: Product[];
  };
  error: Error;
}

//@ts-ignore
const IndexPage: NextPage = ({ data, loading, error }) => {
  // const { data, loading, error } = useQuery(GET_PRODUCTS);
  console.log(data);
  console.log(loading);
  console.log(error);
  const renderProducts = () => {
    if (error) {
      return <div>Could not fetch Products</div>;
    }
    if (loading) {
      return <div>Loading</div>;
    }
    console.log(data);
    return data.products.map((product: Product) => (
      <div key={product.id}>{product.name}</div>
    ));
  };
  return (
    <div>
      Homepage
      <div>{renderProducts()}</div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSideProps) {
  console.log(context);
  //@ts-ignore
  const { data, loading, error } = context.graphQLClient.query({
    query: GET_PRODUCTS,
  });
  return {
    props: {
      data,
      error,
      loading,
    },
  };
}

// IndexPage.getInitialProps = async (ctx) => {
//   try {
//     console.log(ctx);
//     //@ts-ignore
//     const { data, loading, error } = await ctx.apolloClient.query({
//       query: GET_PRODUCTS,
//     });

//     return { data, loading, error };
//   } catch (error) {
//     return {
//       error: 'Failed to fetch',
//     };
//   }
// };

export default IndexPage;
