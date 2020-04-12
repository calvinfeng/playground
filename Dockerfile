FROM golang:1.13.1-alpine as gobuild
WORKDIR /go/src/calvinblog
COPY . .

# Build Go
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64
RUN go build -a -tags netgo -ldflags '-w' -o calvinblog .

FROM alpine:3.7 as deploy
EXPOSE 8080
RUN mkdir p /var/log/calvinblog

RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
RUN apk update && apk add sqlite && apk add socat

WORKDIR /go/bin
# Copy binary
COPY --from=gobuild /go/src/calvinblog/calvinblog .
#
CMD ["./calvinblog"]
