# EDEN Production Containerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY backend/ ./backend/
COPY data/ ./data/
COPY requirements.txt* ./

RUN pip install --no-cache-dir fastapi uvicorn pydantic

EXPOSE 3000
ENV PORT=3000
ENV EDEN_DB_PATH=/app/data/eden_v5.db

CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "3000"]
