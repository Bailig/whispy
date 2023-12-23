FROM ubuntu:latest

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y \
  automake \
  build-essential \
  git \
  libtool \
  make \
  npm \
  wget \
  unzip \
  libprotoc-dev 

WORKDIR /app

## Install protoc

ENV PROTOC_VERSION 25.1

RUN wget https://github.com/protocolbuffers/protobuf/releases/download/v$PROTOC_VERSION/protoc-$PROTOC_VERSION-linux-x86_64.zip && \
  unzip protoc-$PROTOC_VERSION-linux-x86_64.zip -d /usr/local/ && \
  rm -rf protoc-$PROTOC_VERSION-linux-x86_64.zip

ENV PROTOBUF_VERSION 3.21.2

RUN wget https://github.com/protocolbuffers/protobuf-javascript/releases/download/v$PROTOBUF_VERSION/protobuf-javascript-$PROTOBUF_VERSION-linux-x86_64.zip && \
  unzip protobuf-javascript-$PROTOBUF_VERSION-linux-x86_64.zip -d /usr/local/ && \
  rm -rf protobuf-javascript-$PROTOBUF_VERSION-linux-x86_64.zip

## Install protoc-gen-grpc-web

ENV PROTOC_GEN_GRPC_WEB_VERSION 1.5.0

RUN git clone https://github.com/grpc/grpc-web /github/grpc-web && \
  cd /github/grpc-web && \
  git fetch --all --tags --prune && \
  git checkout tags/$PROTOC_GEN_GRPC_WEB_VERSION && \
  make install-plugin && \
  rm -rf /github

## Install protoc-gen-ts

ENV PROTOC_GEN_TS_VERSION 0.15.0

RUN npm install ts-protoc-gen@$PROTOC_GEN_TS_VERSION google-protobuf@$PROTOBUF_VERSION && \
  ln -s /node_modules/.bin/protoc-gen-ts /usr/local/bin/protoc-gen-ts

## Install protoc-gen-python

# RUN pip3 install grpcio-tools
