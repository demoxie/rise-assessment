FROM node:18-alpine

# Install native dependencies for bcrypt (Python, make, g++)
RUN apk add --no-cache make g++ python3

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies, ensuring bcrypt is built for the correct architecture
RUN npm install --silent

RUN npm rebuild bcrypt


# Install ts-node and typescript globally
RUN npm install -g ts-node typescript

# Copy the rest of the application code
COPY . .

EXPOSE 3003

# Start the app using npm start
CMD ["npm", "run", "start"]
