# My Playground

This is a progress tracker for my guitar playing. I am also using it as an AWS infrastructure playground to experiment
with deployment. My initial phase is to use the simplest technology to ensure deployment is successful and then
gradually introduce new component depending on my needs.

## Run with Docker

```bash
docker build -t playground .
```

```bash
docker run --rm -p 8080:8080 playground
```

## Deployment

### Deploy via Heroku

Create a new branch and switch to that branch

```bash
git branch main
git checkout main
```

Build the UI code

```bash
cd playgroundui
npm run build
```

Test the deployment locally

```bash
go build -o bin/playground -v .
heroku local
```

Package everything and commit

```bash
go mod tidy
go mod vendor
git add -A
git commit -m "..."
git push heroku main
```

Don't push it to GitHub because it's too big.

### Deploy via Uploading Zip

Create a zip using `git`.

```bash
git archive -v -o playground-v2020.11.21.zip --format=zip HEAD
```

Then upload it to Elastic Beanstalk.

### Deploy via AWS EB CLI

I got my AWS credentials in root directory.

```bash
eb init --profile calvinfeng
```

Test it locally

```bash
eb local run --port 8080
```

#### Deploy Environment

Create an environment if not exist

```bash
eb create playground-server-env
```

Otherwise,

```bash
eb deploy playground-server-env
```

#### Regular Deployment

Since environment name is already inside the `.elasticbeanstalk` folder, I can just do

```bash
eb deploy
```