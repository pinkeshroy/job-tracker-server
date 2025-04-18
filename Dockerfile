FROM node:18-alpine

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose your application port
EXPOSE 5000

# Start your app (and push schema first)
CMD ["sh", "-c", "npx prisma db push && npm run dev"]
