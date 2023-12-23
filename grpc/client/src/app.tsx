import { Chat } from "./chat";
import { ChatServiceClient } from "generated/chat_grpc_web_pb";

const client = new ChatServiceClient("http://localhost:40000");

client.getMyId({}, undefined, (err, response) => {
  if (err) {
    console.error(err);
  } else {
    console.log(response.toObject());
  }
});

export const App = () => {
  return <Chat />;
};
