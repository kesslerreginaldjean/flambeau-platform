# Plateforme Collège Le Flambeau

Système complet de gestion scolaire avec site web attractif, portail parents/élèves et intégration Kotelam.

## Structure du projet

```
flambeau-platform/
├── frontend/           # Next.js - Site public + Portails
├── backend/            # Express API - Logique métier
├── docs/               # Documentation
└── README.md
```

## Stack technique

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Paiements**: Kotelam (intégration custom)
- **Comptabilité**: Module intégré

## Installation rapide

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

## Roadmap Phase 1 (1-2 mois)

- [ ] Site web landing page
- [ ] Portail d'authentification
- [ ] Gestion notes/scolarité
- [ ] Emplois du temps
- [ ] Module paiements Kotelam
- [ ] Tableau de bord comptable

## Notes importantes

**Kotelam Integration**: Le système de paiement est modulaire pour faciliter l'intégration avec Kotelam et la comptabilité existante.

---
Créé pour Collège Le Flambeau, Delmas 31, Port-au-Prince, Haïti
