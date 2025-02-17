import { ApolloServer } from 'apollo-server-micro';
// import {} from 'micro-cors';
import { schema } from './schema';
import { createContext } from './context';
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from './permissions';
import { formatError } from 'apollo-errors';

const apolloServer = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
  playground: true,
  introspection: true,
  //@ts-ignore
  formatError: formatError,
});

const handler = apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
