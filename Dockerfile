FROM node:22 AS build
WORKDIR /app
COPY package*.json /app/
RUN yarn install
COPY ./ /app/
RUN yarn build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /nyx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
