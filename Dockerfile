FROM node:18

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgconf-2-4 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    lsb-release \
    xdg-utils \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY . .

COPY .cache .cache

RUN npm install -g typescript

RUN npm run build

EXPOSE 4000

ENV PORT=4000

CMD ["npm", "start"]
