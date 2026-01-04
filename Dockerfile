# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
RUN npm install

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy server files
COPY server/package*.json ./server/
RUN cd server && npm install --production

COPY server/ ./server/

# Copy built frontend
COPY --from=frontend-builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p ./server/uploads

# Expose port
EXPOSE 3001

# Start server
WORKDIR /app/server
CMD ["node", "index.js"]
