import {
  ServerUnaryCall,
  sendUnaryData,
  Server,
  ServerCredentials,
} from "@grpc/grpc-js";
import {
  GetMyIdResponse,
  Void,
} from "./generated/proto/services/chat/v1/chat_pb";
import { ChatServiceService } from "./generated/proto/services/chat/v1/chat_grpc_pb";

const server = new Server();

let id = 0;
const getMyId = (
  _: ServerUnaryCall<Void, GetMyIdResponse>,
  callback: sendUnaryData<GetMyIdResponse>,
) => {
  const response = new GetMyIdResponse();
  id++;
  response.setId(String(id));
  callback(null, response);
};

server.addService(ChatServiceService, { getMyId });

server.bindAsync("0.0.0.0:4000", ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("server is running on 0.0.0.0:4000");
});
