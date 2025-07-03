# Base image with Node and bash for VM-style behavior
FROM node:18-bullseye

WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl git nano vim iproute2 net-tools && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm install

EXPOSE 6065

CMD ["npm", "run", "dev"]
