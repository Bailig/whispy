import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import bodyParser from "body-parser";

const pubsub = new PubSub();

const typeDefs = `
  type Query {
    hello: String
  }

  type Mutation {
    sendMessage(content: String!): Message
  }

  type Subscription {
    messageReceived: Message
  }

  type Message {
    id: ID!
    content: String!
  }
`;

class User {
  static id = 0;
  id: number;

  constructor() {
    this.id = User.id++;
  }
}

class Message {
  static id = 0;
  id: number;
  content: string;
  owner: User;

  constructor(owner: User, content: string) {
    this.id = Message.id++;
    this.content = content;
    this.owner = owner;
  }
}

let messageId = 0;

const resolvers = {
  Query: {
    hello: () => "world",
  },
  Mutation: {
    sendMessage: (_, { content }) => {
      messageId++;
      const message = { id: messageId.toString(), content };
      pubsub.publish("MESSAGE_RECEIVED", { messageReceived: message });
      return message;
    },
  },
  Subscription: {
    messageReceived: {
      subscribe: () => {
        const user = new User();
        return pubsub.asyncIterator("MESSAGE_RECEIVED");
      },
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>({
    credentials: true,
  }),
  bodyParser.json(),
  expressMiddleware(server),
);

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`,
  );
});
