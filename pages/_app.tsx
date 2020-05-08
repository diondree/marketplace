import { AppProps } from 'next/app'
// import { ApolloProvider } from 'react-apollo';
import withApolloClient from '../utils/with-apollo-client';
import '../styles/index.css'
import { withApollo } from '../apollo/client';

// export type MyAppProps = AppProps & { apolloClient: any }

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}


export default withApollo(MyApp)
// export default withApolloClient(MyApp);
