import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { Chat } from "./chat";

const client = new Client({
  url: "http://localhost:3000/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

export const App = () => {
  return (
    <Provider value={client}>
      <Chat />
    </Provider>
  );
};
