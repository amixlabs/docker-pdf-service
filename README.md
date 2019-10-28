# PDF Service

Generate PDF from URL page

## Setup

Copy `.env.example` to `.env` and change variables.

```bash
yarn
yarn start:dev
```

## Query String

- `url`, request location
- `x-pdf-options`, `json` url encoded for [page.pdf](https://pptr.dev/#?product=Puppeteer&version=v1.11.0&show=api-pagepdfoptions) options.
- `x-wait-selector`, `selector` url encoded for [page.$](https://pptr.dev/#?product=Puppeteer&version=v1.11.0&show=api-pageselector) selector. It allows page waiting selector resolves before render the page.

> Other `query-string` variables are used to replace request headers.
