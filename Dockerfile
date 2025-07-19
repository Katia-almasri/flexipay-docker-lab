
FROM alpine:latest
COPY . /src
WORKDIR /src
RUN apk update && apk add nodejs npm curl
RUN npm install
EXPOSE 5000
ENTRYPOINT [ "npm", "run", "start" ]