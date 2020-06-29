# My Playground

I am trying to put this on Elastic Beanstalk but I am too cheap to pay for RDS. So I will use SQLite!

## TODO

- Add title to each recording, use it for the buttons

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
