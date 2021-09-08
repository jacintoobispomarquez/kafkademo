FROM node:14-alpine
EXPOSE 8081
RUN apk --no-cache add \
      bash \
      g++ \
      ca-certificates \
      lz4-dev \
      musl-dev \
      cyrus-sasl-dev \
      openssl-dev \
      make \
      python
RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "dist", "./"]
RUN export CPPFLAGS=-I/usr/local/opt/openssl/include
RUN export LDFLAGS=-L/usr/local/opt/openssl/lib
RUN npm install --production && mv node_modules ../
COPY . .
RUN chown -R node /usr/src/app
USER node
CMD npm run start:prod
