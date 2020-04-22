import { GraphQLServer } from 'graphql-yoga';
import { schema } from './schema';
import { createContext } from './context';

const server = new GraphQLServer({
  schema,
  context: { ...createContext() },
});

server.start(
  {
    endpoint: '/graphql',
    playground: '/graphql',
    subscriptions: false,
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  () => console.log(`🚀 Server ready`)
);
