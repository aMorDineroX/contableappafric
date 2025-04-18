#!/bin/bash

# Nettoyer les conteneurs et images inutilisés
docker system prune -f

# Construire l'image de production
docker build --target production -t contafricax:prod .

# Tester l'image de production
docker run --rm -p 8080:80 contafricax:prod

# Messages d'aide
echo "Production image built successfully!"
echo "Test the production build at http://localhost:8080"
echo "To deploy, use: docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
