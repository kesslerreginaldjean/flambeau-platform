/**
 * Documentation de l'architecture
 */

export const ArchitectureDoc = `
# Architecture Collège Le Flambeau

## Vue d'ensemble

Plateforme web complète intégrant :
- Site public attractif
- Portails (élèves, parents, professeurs)
- Gestion académique
- Système de paiements Kotelam
- Module de comptabilité

## Stack technique

### Frontend
- Next.js 14 (Framework React)
- TypeScript
- Tailwind CSS (Design)
- Axios (API client)

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (base de données)
- JWT (Authentification)

### Paiements & Comptabilité
- Intégration Kotelam
- Module de suivi comptable
- Génération de rapports

## Structure des répertoires

\`\`\`
frontend/
├── src/
│   ├── pages/         # Pages Next.js
│   ├── components/    # Composants React
│   ├── lib/          # Utilitaires (API, auth)
│   └── styles/       # Styles Tailwind
├── public/           # Assets statiques
└── next.config.js    # Config Next.js

backend/
├── src/
│   ├── db/          # Base de données
│   ├── routes/      # Routes API
│   ├── controllers/ # Logique métier
│   ├── services/    # Services
│   ├── middleware/  # Middleware
│   ├── modules/
│   │   ├── payments/    # Kotelam
│   │   └── accounting/  # Comptabilité
│   └── index.ts     # Point d'entrée
├── .env.example     # Variables d'environnement
└── tsconfig.json    # Config TypeScript
\`\`\`

## Fonctionnalités prioritaires (Phase 1)

1. **Site web public**
   - Page d'accueil attrayante
   - Présentation de l'école
   - CTA pour connexion

2. **Authentification**
   - Login/Logout
   - 4 rôles: élève, parent, professeur, admin
   - Récupération mot de passe

3. **Gestion académique**
   - Consultation des notes
   - Emplois du temps
   - Absences

4. **Paiements Kotelam**
   - Génération de liens de paiement
   - Suivi des transactions
   - Intégration comptable automatique

5. **Comptabilité**
   - Enregistrement des transactions
   - Rapports mensuels/annuels
   - Export CSV

## Intégration Kotelam

Kotelam est intégré via la classe \`KotelamPaymentService\`:

\`\`\`typescript
const kotelam = createKotelamService({
  apiKey: process.env.KOTELAM_API_KEY,
  apiUrl: process.env.KOTELAM_API_URL,
  merchantId: process.env.KOTELAM_MERCHANT_ID,
});

// Initier un paiement
await kotelam.initiatePayment({
  amount: 5000,
  currency: 'HTG',
  reference: 'STU001-SCOLARITE-2026',
  studentId: 'uuid',
  description: 'Frais de scolarité',
});
\`\`\`

## Variables d'environnement requises

### Backend
\`\`\`
DATABASE_URL=postgresql://...
KOTELAM_API_KEY=xxx
KOTELAM_API_URL=https://api.kotelam.ht
KOTELAM_MERCHANT_ID=xxx
JWT_SECRET=xxx
\`\`\`

### Frontend
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

## Prochaines étapes

1. Installer les dépendances
2. Configurer PostgreSQL
3. Exécuter les migrations
4. Intégrer le logo de l'école
5. Customiser les couleurs
6. Tester les portails
`;
