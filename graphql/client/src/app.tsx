import {
  Client,
  Provider,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
} from "urql";
import { Chat } from "./chat";
import { createClient as createWSClient } from "graphql-ws";

const wsClient = createWSClient({
  url: "ws://localhost:4000/graphql",
});

const client = new Client({
  url: "http://localhost:4000/graphql",
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || "" };
        return {
          subscribe(sink) {
            const unsubscribe = wsClient.subscribe(input, sink);
            return { unsubscribe };
          },
        };
      },
    }),
  ],
});

export const App = () => {
  return (
    <Provider value={client}>
      <Chat />
    </Provider>
  );
};
