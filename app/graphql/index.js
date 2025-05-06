const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const setupApolloServer = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return {
        message: error.message,
        path: error.path,
      };
    },
    context: ({ req }) => ({}),
  });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  console.log(
    `🚀 GraphQL server ready at http://localhost:${process.env.PORT || 3000}${
      server.graphqlPath
    }`
  );

  return server;
};

module.exports = setupApolloServer;
