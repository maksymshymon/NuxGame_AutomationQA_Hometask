# Перед запуском переконатися що версія playwright 
# в package.json збігається з версією в цьому файлі
FROM mcr.microsoft.com/playwright:v1.63.0-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV CI=true

CMD ["npx", "playwright", "test"]
