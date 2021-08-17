require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;

const server = new ApolloServer({
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

server
  .listen(PORT)
  .then(() =>
    console.log(`🚀 Server is running on http://localhost:${PORT} ✅`),
  );
