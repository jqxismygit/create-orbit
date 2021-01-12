FROM harbor.sensoro.com/library/node:10 AS yarn
# RUN npm i yarn -g

FROM yarn AS builder
COPY package.json yarn.lock .npmrc ./
RUN yarn
ADD . .
ARG CONFIG_ENV
RUN yarn run build

FROM yarn
COPY --from=harbor.sensoro.com/library/nginx:qshell-v2.3.8 /bin/qshell /bin/qshell
RUN apk add --no-cache nginx
COPY --from=builder /opt/app/dist /opt/app/res
COPY package.json .
COPY yarn.lock .
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/start-nginx.sh /opt/app
CMD ["sh", "/opt/app/start-nginx.sh"]
