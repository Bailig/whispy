import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import EventEmitter from "node:events";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROTO_PATH = __dirname + "/chat.proto";

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const { chat } = protoDescriptor;

const server = new grpc.Server();

const emitter = new EventEmitter();

let userId = 0;
function getMyId(_, callback) {
  userId++;
  callback(null, { id: userId });
}

class Message {
  static id = 0;
  constructor(ownerId, content) {
    Message.id++;
    this.id = Message.id;
    this.content = content;
    this.ownerId = ownerId;
  }
}

function sendMessage(call, callback) {
  const { ownerId, content } = call.request;
  const message = new Message(ownerId, content);
  emitter.emit("message", message);
  callback(null, {});
}

function receiveMessage(call) {
  emitter.on("message", (message) => {
    call.write(message);
  });
}

server.addService(chat.ChatService.service, {
  getMyId,
  sendMessage,
  receiveMessage,
});

server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Server running at http://localhost:40000");
  },
);
