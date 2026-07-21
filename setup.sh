#!/bin/bash

# 🔥 Script d'initialisation Collège Le Flambeau
# Exécuter dans le répertoire racine du projet

echo "🔥 Initialisation Collège Le Flambeau"
echo "===================================="
echo ""

# Vérifier Node.js
echo "✓ Vérification Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Télécharger depuis https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js trouvé: $(node --version)"

# Vérifier npm
echo "✓ Vérification npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi
echo "✓ npm trouvé: $(npm --version)"

# Backend setup
echo ""
echo "📦 Installation Backend..."
cd backend
cp .env.example .env
echo "⚠️  Éditer backend/.env avec vos paramètres (DB, Kotelam, JWT)"
npm install
cd ..

# Frontend setup
echo ""
echo "📦 Installation Frontend..."
cd frontend
cp .env.local.example .env.local
npm install
cd ..

# Information
echo ""
echo "✅ Initialisation terminée!"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Éditer backend/.env avec:"
echo "   - Paramètres PostgreSQL"
echo "   - Credentials Kotelam"
echo "   - JWT secret"
echo ""
echo "2. Configurer PostgreSQL:"
echo "   - Créer base de données 'flambeau_db'"
echo "   - Créer utilisateur 'flambeau_user'"
echo ""
echo "3. Exécuter migrations:"
echo "   cd backend && npm run db:migrate"
echo ""
echo "4. Démarrer les serveurs:"
echo "   Backend:  cd backend && npm run dev"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "📚 Documentation: lire GETTING_STARTED.md"
