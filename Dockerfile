FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

# On s'assure que les ports sont bien ouverts
EXPOSE 3001
EXPOSE 5173

# Utilise npm run pour lancer le script défini dans le package.json
CMD ["npm", "run", "start:docker"]