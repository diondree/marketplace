import { ApolloServer } from 'apollo-server-micro';
import { schema } from './schema';
import { createContext } from './context';

// const server = new GraphQLServer({
//   schema,
//   context: { ...createContext() },
// });

// server.start(
//   {
//     endpoint: '/graphql',
//     playground: '/graphql',
//     subscriptions: false,
//     cors: {
//       credentials: true,
//       origin: process.env.FRONTEND_URL,
//     },
//   },
//   () => console.log(`🚀 Server ready`)
// );

// export default async (req, res) => {
//   const query = req.body.query;
//   const variables = req.body.variables;
//   const response = await graphql(schema, query, {}, {}, variables);
//   return res.end(JSON.stringify(response));
// };
const apolloServer = new ApolloServer({
  schema,
  context: createContext,
  playground: true,
  introspection: true,
});
console.log('heree');

const handler = apolloServer.createHandler({ path: '/api' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
