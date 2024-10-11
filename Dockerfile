FROM node:18-alpine
RUN apk add --no-cache make g++ python3
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
RUN npm rebuild bcrypt
RUN npm install -g ts-node typescript
COPY . .
EXPOSE 3003
CMD ["npm", "run", "start"]
