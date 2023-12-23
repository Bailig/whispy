1. Open Docker and run the following to generate typescript code from the protobuf files:

```bash
docker run \
  -v `pwd`/proto:/proto \
  -v `pwd`/src/generated:/generated \
  jfbrandhorst/grpc-web-generators \
  protoc -I /proto \
  --js_out=import_style=typescript:/generated \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:/generated \
  /proto/chat.proto
```
