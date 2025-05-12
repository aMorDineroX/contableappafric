FROM node:24

WORKDIR /app

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y python3 make g++

# Copier les fichiers de configuration
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copier le reste du code source
COPY . .

EXPOSE 5173

# Modifier la commande pour permettre l'accès externe
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]