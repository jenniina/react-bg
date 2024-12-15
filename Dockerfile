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

RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npx puppeteer install

RUN npx puppeteer browsers install chrome

RUN npm install -g typescript

RUN npm run build

EXPOSE 4000

ENV PORT=4000

CMD ["npm", "start"]
