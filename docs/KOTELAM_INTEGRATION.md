# Guide Kotelam & Comptabilité

## Qu'est-ce que Kotelam?

Kotelam est une **caisse populaire numérique haïtienne** permettant les transferts d'argent et les paiements électroniques. C'est le système utilisé par le Collège Le Flambeau pour gérer les paiements.

## Intégration Kotelam

### Architecture

```
┌─────────────────┐
│  Frontend       │
│  (Parent/       │
│   Élève)        │
└────────┬────────┘
         │
    Demande de paiement
         │
┌────────▼────────┐      ┌──────────────┐
│  Backend API    │─────▶│  Kotelam     │
│  (Express)      │      │  API         │
└────────┬────────┘      └──────────────┘
         │
    Transaction confirmée
         │
┌────────▼────────────────┐
│ Accounting Module       │
│ (Enregistrement auto)   │
└─────────────────────────┘
```

### Fichiers clés

- **Module Paiements**: `src/modules/payments/kotelam.ts`
- **Module Comptabilité**: `src/modules/accounting/index.ts`
- **Configuration**: `.env`

### Flux de paiement

#### 1️⃣ Élève/Parent initie un paiement

```typescript
// Frontend
const paymentLink = await fetch('/api/payments/initiate', {
  method: 'POST',
  body: JSON.stringify({
    studentId: 'UUID',
    amount: 5000, // HTG
    type: 'tuition', // scolarité
  })
});

// Redirige vers le lien Kotelam
```

#### 2️⃣ Backend traite la demande

```typescript
// Backend
const kotelam = createKotelamService(config);
const payment = await kotelam.initiatePayment({
  amount: 5000,
  currency: 'HTG',
  reference: `STU-${studentId}-TUITION`,
  studentId: studentId,
  description: 'Frais de scolarité',
  customerEmail: student.email,
});
```

#### 3️⃣ Kotelam traite le paiement

- L'utilisateur effectue le paiement via Kotelam
- Kotelam confirme la transaction
- Webhook callback vers le backend

#### 4️⃣ Backend enregistre la transaction

```typescript
// Automatiquement via webhook
const accounting = createAccountingService(pool);
await accounting.recordPayment(
  studentId,
  5000,
  'tuition',
  kotelam.reference
);

// Mise à jour en DB:
// - Table payments: statut = 'completed'
// - Table accounting_transactions: enregistrement de revenu
```

## Configuration Kotelam

### Obtenir les credentials

1. Contacter Kotelam: `support@kotelam.ht`
2. Créer un compte marchand
3. Récupérer:
   - `API_KEY`
   - `MERCHANT_ID`
   - `API_URL` (production ou test)

### Configurer le backend

**Fichier: `.env`**
```env
KOTELAM_API_KEY=your_api_key_from_kotelam
KOTELAM_API_URL=https://api.kotelam.ht  # ou sandbox si existe
KOTELAM_MERCHANT_ID=your_merchant_id
```

### Tests Kotelam

```bash
# Vérifier la connexion
curl -X GET \
  https://api.kotelam.ht/merchants/YOUR_MERCHANT_ID/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Module de Comptabilité

### Flux comptable

```
Paiement reçu
    │
    ▼
Webhook confirmation
    │
    ▼
Enregistrement transaction
    │
    ├─ Type: "income"
    ├─ Montant: 5000 HTG
    ├─ Compte: 4000 (Revenus)
    └─ Balance updated
    │
    ▼
Disponible pour rapports
```

### Codes de compte comptable

| Code | Description | Type |
|------|-------------|------|
| 1000 | Banque (Cash) | Actif |
| 4000 | Revenus scolarité | Revenu |
| 4100 | Autres revenus | Revenu |
| 6000 | Dépenses | Dépense |
| 6100 | Salaires | Dépense |

### Générer un rapport

```typescript
// API Backend
const report = await accounting.getReport(
  new Date('2026-01-01'),
  new Date('2026-03-31')
);

// Réponse:
{
  totalIncome: 250000,      // Total revenus
  totalExpenses: 100000,    // Total dépenses
  netIncome: 150000,        // Revenus nets
  currentBalance: 500000,   // Balance actuelle
  transactionCount: 45,     // Nombre de transactions
  period: {
    startDate: '2026-01-01',
    endDate: '2026-03-31'
  }
}
```

### Export CSV

```typescript
const csv = await accounting.exportToCSV(
  new Date('2026-01-01'),
  new Date('2026-03-31')
);

// Sauvegarder ou envoyer par email
```

## Scénarios d'utilisation

### ✅ Élève paie la scolarité via Kotelam

1. Élève clique "Payer" sur le portail
2. Système génère lien Kotelam
3. Élève complète paiement dans Kotelam
4. Kotelam confirme à notre backend
5. **Automatiquement**: 
   - Statut paiement = "complété"
   - Enregistrement comptable créé
   - Parent notifié par email
   - Dashboard mis à jour

### ✅ Admin génère rapport mensuel

1. Admin accède au dashboard comptabilité
2. Sélectionne mois (ex: Février 2026)
3. Système génère rapport:
   - Revenus par type
   - Dépenses
   - Balance
4. Option export CSV pour Excel/comptable

### ✅ Paiement échoue

1. Kotelam notification d'échec
2. Paiement reste en "pending"
3. Élève peut réessayer
4. Relance email au parent après X jours

## Intégration avec votre comptabilité existante

Pour connecter avec votre comptabilité existante:

### Option 1: Export CSV régulier
```bash
# Export hebdomadaire
GET /api/accounting/export?format=csv&start=2026-02-01&end=2026-02-07
```

### Option 2: Webhook comptabilité
```typescript
// Chaque transaction envoie automatiquement à votre système
POST https://your-accounting-system.com/api/transactions
{
  reference: "TXN-001",
  amount: 5000,
  type: "income",
  student: "STU-001",
  date: "2026-02-15"
}
```

### Option 3: API synchronisation
```typescript
// Votre système appelle notre API
GET /api/accounting/transactions?since=2026-02-01
```

## Webhooks Kotelam

Les webhooks permettent la communication en temps réel:

### Configuration

```javascript
// Backend: Endpoint webhook
POST /api/webhooks/kotelam
{
  event: "payment.completed",
  transaction_id: "TX-001",
  status: "completed",
  amount: 5000,
  reference: "STU-001-TUITION",
  timestamp: "2026-02-15T14:30:00Z"
}
```

### Gestion automatique

```typescript
app.post('/api/webhooks/kotelam', async (req, res) => {
  const { event, transaction_id, status, amount, reference } = req.body;

  if (event === 'payment.completed') {
    // Mettre à jour paiement
    await updatePayment(transaction_id, 'completed');
    
    // Enregistrer comptabilité
    await accounting.recordPayment(...);
    
    // Notifier parents/élèves
    await sendNotification(...);
  }
  
  res.json({ received: true });
});
```

## FAQ Kotelam

**Q: Combien de frais Kotelam prend-elle?**  
R: À confirmer avec Kotelam. Généralement 1-3% par transaction.

**Q: Puis-je tester avant production?**  
R: Oui, Kotelam propose un environnement sandbox. Utilisez une URL de test.

**Q: Quels types de paiements accepte Kotelam?**  
R: Virement bancaire, Mobile Money, Kotelam account. À confirmer.

**Q: Comment être remboursé si paiement erroné?**  
R: Contacter Kotelam. Notre système track tous les paiements pour audits.

## Support & Ressources

- 📧 Kotelam Support: support@kotelam.ht
- 📞 Kotelam Hotline: +509 XXXX XXXX
- 🔗 Kotelam Docs: https://api.kotelam.ht/docs
- 💬 Notre équipe: tech@leflambeau.edu.ht

---

**Important**: Tester d'abord en **environnement de test** avant de passer en production!
