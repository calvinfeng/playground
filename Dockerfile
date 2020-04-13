FROM golang:1.14.1-alpine as gobuild
WORKDIR /go/src/calvinblog
COPY . .

# Build Go
# Since we are relying on a SQLite3 driver in C, we need to build Go with CGO.
# In order to build CGO, we need GCC.
ENV CGO_ENABLED=1
ENV GOOS=linux
ENV GOARCH=amd64
RUN apk add --update gcc musl-dev
RUN go build -a -tags alphine -ldflags '-w' -o calvinblog .

FROM node:12 as nodebuild
WORKDIR /home/node/blogui
COPY ./blogui .

# Build JavaScripts
RUN npm install
RUN npm run build

FROM alpine:3.7 as deploy
EXPOSE 8080

RUN mkdir p /var/log/calvinblog
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
RUN apk update && apk add sqlite && apk add socat

WORKDIR /go/bin
# Copy binary, static files, & SQL database
COPY --from=gobuild /go/src/calvinblog/calvinblog .
COPY --from=gobuild /go/src/calvinblog/blog.db .
COPY --from=nodebuild /home/node/blogui/build ./blogui/build/
COPY --from=gobuild /go/src/calvinblog/migrations ./migrations

CMD ["./calvinblog", "serve"]