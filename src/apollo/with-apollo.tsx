import React from 'react';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/react-hooks';
import { getInitialState } from 'graphql-hooks-ssr';
import { initApolloClient } from './init-client';

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
// export function withApollo(PageComponent: Function, { ssr = true } = {}) {
//   const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
//     const client = apolloClient || initApolloClient(apolloState);
//     return (
//       <ApolloProvider client={client}>
//         <PageComponent {...pageProps} />
//       </ApolloProvider>
//     );
//   };

//   // Set the correct displayName in development
//   if (process.env.NODE_ENV !== 'production') {
//     const displayName =
//       PageComponent.displayName || PageComponent.name || 'Component';

//     if (displayName === 'App') {
//       console.warn('This withApollo HOC only works with PageComponents.');
//     }

//     WithApollo.displayName = `withApollo(${displayName})`;
//   }

//   if (ssr || PageComponent.getInitialProps) {
//     WithApollo.getInitialProps = async (ctx) => {
//       const { AppTree } = ctx;

//       // Initialize ApolloClient, add it to the ctx object so
//       // we can use it in `PageComponent.getInitialProp`.
//       const apolloClient = (ctx.apolloClient = initApolloClient());

//       // Run wrapped getInitialProps methods
//       let pageProps = {};
//       if (PageComponent.getInitialProps) {
//         pageProps = await PageComponent.getInitialProps(ctx);
//       }

//       // Only on the server:
//       if (typeof window === 'undefined') {
//         // When redirecting, the response is finished.
//         // No point in continuing to render
//         if (ctx.res && ctx.res.finished) {
//           return pageProps;
//         }

//         // Only if ssr is enabled
//         if (ssr) {
//           try {
//             // Run all GraphQL queries
//             const { getDataFromTree } = await import('@apollo/react-ssr');
//             await getDataFromTree(
//               <AppTree
//                 pageProps={{
//                   ...pageProps,
//                   apolloClient,
//                 }}
//               />
//             );
//           } catch (error) {
//             // Prevent Apollo Client GraphQL errors from crashing SSR.
//             // Handle them in components via the data.error prop:
//             // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
//             console.error('Error while running `getDataFromTree`', error);
//           }

//           // getDataFromTree does not call componentWillUnmount
//           // head side effect therefore need to be cleared manually
//           Head.rewind();
//         }
//       }

//       // Extract query data from the Apollo store
//       const apolloState = apolloClient.cache.extract();
//       return {
//         ...pageProps,
//         apolloState,
//       };
//     };
//   }

//   return WithApollo;
// }

export default (App: any) => {
  return class GraphQLHooks extends React.Component {
    static displayName = 'GraphQLHooks(App)';
    static async getInitialProps(ctx: any) {
      const { AppTree } = ctx;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const graphQLClient = initApolloClient({});
      let graphQLState = {};
      if (typeof window === 'undefined') {
        try {
          // Run all GraphQL queries
          graphQLState = await getInitialState({
            App: <AppTree {...appProps} graphQLClient={graphQLClient} />,
            client: graphQLClient,
          });
        } catch (error) {
          // Prevent GraphQL hooks client errors from crashing SSR.
          // Handle them in components via the state.error prop:
          // https://github.com/nearform/graphql-hooks#usequery
          console.error('Error while running `getInitialState`', error);
        }

        // getInitialState does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      return {
        ...appProps,
        graphQLState,
      };
    }

    constructor(props: any) {
      super(props);
      //@ts-ignore
      this.graphQLClient = initApolloClient(props.graphQLState);
    }

    render() {
      //@ts-ignore
      return <App {...this.props} graphQLClient={this.graphQLClient} />;
    }
  };
};
