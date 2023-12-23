1. Open Docker and run the following to generate typescript code from the protobuf files:

```bash
docker build -t grpc-web-ts-gen .
docker run \
    -v `pwd`/proto:/proto \
    -v `pwd`/node_modules/generated:/generated \
    grpc-web-ts-gen \
    protoc -I /proto \
        --js_out=import_style=commonjs:/generated \
        --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:/generated \
        /proto/chat.proto
```
