FROM node:latest
LABEL maintainer "Kohei Sugimura <sugimurakohei@sugimuracraft.com>"

RUN mkdir /opt/app
WORKDIR /opt

RUN npm install inngest express tunnel-ssh mysql2 inngest-cli tsx

WORKDIR /opt/app
