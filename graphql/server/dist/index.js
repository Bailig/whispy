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
    hello: String!
    myId: ID!
  }

  type Mutation {
    sendMessage(ownerId: ID!, content: String!): Message!
  }

  type Subscription {
    messageReceived: Message
  }

  type Message {
    id: ID!
    ownerId: ID!
    content: String!
  }
`;
class Message {
    constructor(ownerId, content) {
        Message.id++;
        this.id = Message.id;
        this.content = content;
        this.ownerId = ownerId;
    }
}
Message.id = 0;
let userId = 0;
const resolvers = {
    Query: {
        hello: () => "world",
        myId: () => {
            userId++;
            return userId;
        },
    },
    Mutation: {
        sendMessage: (_, { ownerId, content }) => {
            const message = new Message(Number.parseInt(ownerId), content);
            pubsub.publish("MESSAGE_RECEIVED", { messageReceived: message });
            return message;
        },
    },
    Subscription: {
        messageReceived: {
            subscribe: () => {
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
app.use("/graphql", cors({
    credentials: true,
}), bodyParser.json(), expressMiddleware(server));
const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
});
