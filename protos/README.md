# Protobufs

## Compile

```
docker pull namely/protoc-all
```

Compile API package

```
docker run -v `pwd`/defs/:/defs namely/protoc-all -d api -l go -o go/api/
```