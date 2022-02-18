FROM harbor.sensoro.com/library/node:12 AS yarn


FROM yarn AS builder
COPY .npmrc ./
COPY package.prod.json ./package.json
RUN yarn
ADD . .
ARG CONFIG_ENV
RUN yarn run build


FROM nginx:alpine
COPY --from=builder /opt/app/dist /opt/app/<%= name %>
COPY package.json .
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
