FROM node:18-alpine

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Push Prisma schema to the database
RUN npx prisma db push

# Expose your application port
EXPOSE 5000

# Start your app
CMD ["npm", "run", "dev"]
