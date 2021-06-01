[![Release](https://github.com/amixlabs/docker-pdf-service/actions/workflows/release.yml/badge.svg)](https://github.com/amixlabs/docker-pdf-service/actions/workflows/release.yml)

# About this Repo

This is the Git repo of the official Docker image for [amixlabs/pdf-service](https://hub.docker.com/r/amixlabs/pdf-service/).
See the Hub page for the full readme on how to use the Docker image and for
information regarding contributing and issues.

Common build usage:

```bash
docker build \
  --build-arg "http_proxy=$http_proxy" \
  --build-arg "https_proxy=$https_proxy" \
  --build-arg "no_proxy=$no_proxy" \
  -t amixlabs/pdf-service:latest \
  .
```

Publish

```bash
docker login
docker push amixlabs/pdf-service
```

Using `docker-compose.yml`:

```yml
version: '2'
services:
  pdf:
    image: amixlabs/pdf-service
    port:
    - 3000:3000
```

## PDF Service

Generate PDF from URL page

### Setup

Copy `.env.example` to `.env` and change variables.

```bash
yarn
yarn start:dev
```

### Query String

- `url`, request location
- `x-pdf-options`, `json` url encoded for
[page.pdf](https://pptr.dev/#?product=Puppeteer&version=v1.11.0&show=api-pagepdfoptions)
options.
- `x-wait-selector`, `selector` url encoded for
[page.$](https://pptr.dev/#?product=Puppeteer&version=v1.11.0&show=api-pageselector)
selector. It allows page waiting selector resolves before render the page.

> Other `query-string` variables are used to replace request headers.
