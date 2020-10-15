FROM node:12-alpine

# Installs latest Chromium package.
RUN apk add --no-cache \
    ca-certificates \
    chromium \
    harfbuzz \
    nss \
    bash \
    tini

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV CHROMIUM_BROWSER /usr/bin/chromium-browser

WORKDIR /app

ADD package.json yarn.lock ./
RUN yarn --production

ADD . ./

VOLUME [ "/app/tmp" ]

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "node", "src/server.js" ]
