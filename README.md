# Calvin Blog

I am trying to put this on Elastic Beanstalk but I am too cheap to pay for RDS. So I will use SQLite!

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
eb create calvinblog-server-environment
```

Otherwise,

```bash
eb deploy calvinblog-server-environment
```

