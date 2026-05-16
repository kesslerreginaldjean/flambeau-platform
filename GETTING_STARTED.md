# Guide de démarrage - Collège Le Flambeau

## Prérequis

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **PostgreSQL** 14+ ([Télécharger](https://www.postgresql.org/))
- **Git** (optionnel)

## Installation rapide

### 1️⃣ Configuration PostgreSQL

```bash
# Créer la base de données
createdb flambeau_db

# Créer l'utilisateur
psql -U postgres -c "CREATE USER flambeau_user WITH PASSWORD 'secure_password_here';"
psql -U postgres -c "ALTER ROLE flambeau_user WITH CREATEDB;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE flambeau_db TO flambeau_user;"
```

### 2️⃣ Variables d'environnement

#### Backend (.env)
```bash
cd backend
cp .env.example .env

# Éditer .env avec vos paramètres:
# - Database credentials
# - Kotelam API credentials
# - JWT secret
```

#### Frontend (.env.local)
```bash
cd ../frontend
cp .env.local.example .env.local
```

### 3️⃣ Installation des dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 4️⃣ Exécuter les migrations de la base de données

```bash
cd backend
npm run db:migrate
```

### 5️⃣ Démarrer les serveurs

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# ✓ Serveur backend: http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# ✓ Site web: http://localhost:3000
```

## Utilisation

### 🌐 Site public
- URL: http://localhost:3000
- Page d'accueil avec présentation de l'école

### 🔐 Portails de connexion
- Page: http://localhost:3000/login
- Sélectionner le type d'utilisateur:
  - **Élève** → http://localhost:3000/dashboard/student
  - **Parent** → http://localhost:3000/dashboard/parent
  - **Professeur** → http://localhost:3000/dashboard/teacher
  - **Admin** → http://localhost:3000/dashboard/admin

### 📊 API Backend
- Base URL: http://localhost:5000
- Santé: http://localhost:5000/api/health

## Structure des fichiers clés

```
flambeau-platform/
├── frontend/
│   ├── src/pages/login.tsx      # Page de connexion
│   ├── src/components/Header.tsx # Navigation
│   └── src/lib/api.ts            # Client API
│
├── backend/
│   ├── src/index.ts              # Point d'entrée serveur
│   ├── src/db/migrations/        # Migrations BD
│   ├── src/modules/payments/     # Kotelam
│   └── src/modules/accounting/   # Comptabilité
│
├── README.md                      # Ce fichier
└── ARCHITECTURE.md               # Détails techniques
```

## Intégration Kotelam

Kotelam est configuré mais en attente de credentials réels:

1. **Récupérer les credentials** auprès de Kotelam
2. **Mettre à jour** `.env` avec:
   ```
   KOTELAM_API_KEY=your_api_key
   KOTELAM_API_URL=https://api.kotelam.ht
   KOTELAM_MERCHANT_ID=your_merchant_id
   ```
3. **Redémarrer** le backend

## Dépannage

### "Port 5000 déjà utilisé"
```bash
# Trouver le processus
lsof -i :5000

# Ou utiliser un autre port
PORT=5001 npm run dev
```

### "PostgreSQL connection refused"
```bash
# Vérifier que PostgreSQL est en cours d'exécution
# Windows: Vérifier Services
# macOS: brew services list
# Linux: systemctl status postgresql
```

### "npm command not found"
- Node.js n'est pas installé ou pas dans le PATH
- Redémarrer le terminal après installation

## Prochaines étapes

- [ ] Intégrer le logo de l'école
- [ ] Personnaliser les couleurs (primaire, secondaire)
- [ ] Créer des comptes de test
- [ ] Tester l'intégration Kotelam
- [ ] Configurer le domaine personnalisé
- [ ] Déployer en production

## Support

Pour toute question ou problème:
- 📧 Email: tech@leflambeau.edu.ht
- 💬 Issues: Créer une issue sur ce projet
- 📞 Appel: Contacter l'administrateur IT

---

**Version**: 1.0.0  
**Dernière mise à jour**: Avril 2026  
**Statut**: En développement (Phase 1)
