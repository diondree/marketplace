import { ApolloServer } from 'apollo-server-micro';
import { schema } from './schema';
import { createContext } from './context';

const apolloServer = new ApolloServer({
  schema,
  context: createContext,
  playground: true,
  introspection: true,
});

const handler = apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
