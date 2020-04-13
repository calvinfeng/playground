# My Playground

I am trying to put this on Elastic Beanstalk but I am too cheap to pay for RDS. So I will use SQLite!

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
eb init --profile cfeng-aws
```

Test it locally

```bash
eb local run --port 8080
```

Create an environment if not exist

```bash
eb create playground-server-environment
```

Otherwise,

```bash
eb deploy playground-server-environment
```
