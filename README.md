# My Playground

This is a progress tracker for my guitar playing. I am also using it as an AWS infrastructure playground to experiment
with deployment. My initial phase is to use the simplest technology to ensure deployment is successful and then
gradually introduce new component depending on my needs.

## Docker

```bash
docker build -t playground .
```

```bash
docker run --rm -p 8080:8080 playground
```

## Deployment

I got my AWS credentials in root directory.

```bash
eb init --profile calvinfeng
```

Test it locally

```bash
eb local run --port 8080
```

### Deploy Environment

Create an environment if not exist

```bash
eb create playground-server-env
```

Otherwise,

```bash
eb deploy playground-server-env
```

### Regular Deployment

Since environment name is already inside the `.elasticbeanstalk` folder, I can just do

```bash
eb deploy
```
