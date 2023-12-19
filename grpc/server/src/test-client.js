import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROTO_PATH = __dirname + "/chat.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const { chat } = grpc.loadPackageDefinition(packageDefinition);
const client = new chat.ChatService(
  "localhost:40000",
  grpc.credentials.createInsecure(),
);

let myId = 0;
client.getMyId({}, (err, response) => {
  if (err) {
    console.error(err);
    return;
  }
  myId = response.id;
});

let msgCount = 0;
setInterval(() => {
  msgCount++;
  client.sendMessage({ ownerId: myId, content: "Hello" + msgCount }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}, 1000);

const call = client.receiveMessage();
call.on("data", (message) => {
  console.log(message);
});
