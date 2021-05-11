FROM harbor.sensoro.com/library/node:10 AS yarn


FROM yarn AS builder
COPY package.json .npmrc ./
RUN yarn
ADD . .
ARG CONFIG_ENV
RUN yarn run build
RUN rm -rf /usr/local/share/.cache/yarn /node_modules


FROM nginx:alpine
COPY --from=builder /opt/app/dist /opt/app/<%= name %>
COPY package.json .
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
