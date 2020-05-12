import App, { AppProps } from 'next/app';
// import { ApolloProvider } from 'react-apollo';
import '../styles/index.css';
import { ClientContext } from 'graphql-hooks';
import withApollo from '../apollo/with-apollo';

// export type MyAppProps = AppProps & { apolloClient: any }

// function MyApp({ Component, pageProps }: AppProps) {
//   //@ts-ignore
//   const { graphQLClient } = Component;
//   return (
//     <ClientContext.Provider value={graphQLClient}>
//       <Component {...pageProps} />
//     </ClientContext.Provider>
//   );
// }

class MyApp extends App {
  render() {
    //@ts-ignore
    const { Component, pageProps, graphQLClient } = this.props;
    return (
      <ClientContext.Provider value={graphQLClient}>
        <Component {...pageProps} />
      </ClientContext.Provider>
    );
  }
}

export default withApollo(MyApp);
