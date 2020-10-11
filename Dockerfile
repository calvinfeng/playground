FROM golang:1.14.1-alpine as gobuild
WORKDIR /go/src/playground
COPY . .

# Build Go
# Since we are relying on a SQLite3 driver in C, we need to build Go with CGO.
# In order to build CGO, we need GCC.
ENV CGO_ENABLED=1
ENV GOOS=linux
ENV GOARCH=amd64
RUN apk add --update gcc musl-dev
RUN go build -a -tags alphine -ldflags '-w' -o playground .

FROM node:12 as nodebuild
WORKDIR /home/node/playgroundui
COPY ./playgroundui .

# Build JavaScripts
RUN npm install
RUN npm run build

FROM alpine:3.7 as deploy
EXPOSE 8080

RUN mkdir p /var/log/playground
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
RUN apk update && apk add sqlite && apk add socat

WORKDIR /go/bin
# Copy binary, static files, & SQL database
COPY --from=gobuild /go/src/playground/playground .
COPY --from=gobuild /go/src/playground/blog.db .
COPY --from=gobuild /go/src/playground/conf ./conf
COPY --from=nodebuild /home/node/playgroundui/build ./playgroundui/build

CMD ["./playground", "--config", "production", "serve"]
