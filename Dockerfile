FROM node:18

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads

EXPOSE 3000
CMD ["npm", "start"]
