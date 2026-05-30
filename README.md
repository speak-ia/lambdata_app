# Lambdata

**Infrastructure africaine souveraine de collecte de données IA**

PWA mobile-first inspirée de Google Crowdsource, adaptée aux langues et contextes africains (voix, images, traductions, validation communautaire).

## Architecture

```
lambdata_app/
├── web/                 # Next.js 15 PWA (frontend)
│   ├── app/             # App Router
│   ├── components/      # UI réutilisable
│   ├── features/        # Logique métier par domaine
│   ├── hooks/
│   ├── store/           # Zustand
│   ├── offline/         # IndexedDB (Dexie)
│   ├── pwa/             # Service worker registration
│   └── types/
├── api/                 # NestJS + Prisma
│   ├── prisma/
│   └── src/
└── docker-compose.yml   # PostgreSQL, Redis, MinIO (S3)
```

## Stack

| Couche | Technologies |
|--------|-------------|
| Frontend | Next.js 15, TypeScript, Tailwind v4, shadcn/ui, Framer Motion, Zustand, TanStack Query |
| Offline | Dexie (IndexedDB), file d'upload, sync automatique |
| PWA | manifest.json, service worker, installable |
| Backend | NestJS, Prisma, PostgreSQL, Redis, JWT, Swagger |
| Storage | MinIO (compatible S3) |

## Design system

- **Couleurs** : vert émeraude (primary), orange sable (accent), or (gamification)
- **Polices** : Inter (corps), Poppins (titres)
- **UX** : bottom navigation, cartes arrondies, écrans tâche plein écran (style Crowdsource)

## Dépôt GitHub

- **Repo** : https://github.com/speak-ia/lambdata_app
- **Déploiement** : [docs/DEPLOY-VERCEL-FIREBASE.md](docs/DEPLOY-VERCEL-FIREBASE.md) (Vercel + Firebase Auth + GCS)

## Démarrage rapide

### Prérequis

- Node.js 20+
- Docker (PostgreSQL, Redis, MinIO)

### Installation

```bash
# Toujours depuis la racine lambdata_app/ (pas depuis api/)
cd /chemin/vers/lambdata_app
npm install
npm run setup

cp web/.env.example web/.env.local
cp api/.env.example api/.env
# Vérifier que DATABASE_URL utilise le port 5433 (Docker Lambdata)
```

### Développement

```bash
# Depuis la racine uniquement
npm run dev
```

### Dépannage

| Erreur | Cause | Solution |
|--------|--------|----------|
| `port 5432 already allocated` | PostgreSQL local déjà actif | Lambdata utilise le port **5433** (`docker-compose.yml`) |
| `P1000 Authentication failed` | Prisma pointe vers le mauvais Postgres (5432) | Mettre `localhost:5433` dans `api/.env` |
| `npm error Missing script: "dev"` | Commande lancée dans `api/` | Lancer `npm run dev` depuis la **racine** |
| Postgres container ne démarre pas | Ancien conteneur bloqué | `docker compose down && docker compose up -d` |

- **PWA** : http://localhost:3000
- **API** : http://localhost:3001/api/v1
- **Swagger** : http://localhost:3001/api/docs

## Fonctionnalités (phase 1 — livré)

- [x] Splash screen + routing auth
- [x] Login / Register / Invité / placeholders Google & OTP
- [x] Dashboard (niveau, XP, stats, grille de missions)
- [x] Bottom nav : Accueil, Réussites, Classement
- [x] Modules : Audio, Traduction, Images, Validation
- [x] Profil + thème clair/sombre
- [x] Offline : IndexedDB, bannière hors ligne, sync queue
- [x] PWA : manifest, service worker
- [x] API NestJS + schéma Prisma complet
- [x] Docker Compose

## App mobile (icône sur l’écran d’accueil)

| Plateforme | Rapide (PWA) | App native (dev) |
|------------|--------------|------------------|
| **Android** | Chrome → Installer l’app | [APK-ANDROID.md](docs/APK-ANDROID.md) · `npm run android:open` |
| **iPhone** | Safari → Sur l’écran d’accueil | [IPHONE-IOS.md](docs/IPHONE-IOS.md) · `npm run ios:open` |

## Prochaines étapes

- Auth JWT complète (OTP SMS, Google OAuth)
- Upload multipart S3 + compression média
- WebSocket leaderboard temps réel
- Module vidéo & texte
- Admin dashboard + analytics
- Push notifications
- CI/CD (Vercel + AWS)

## Licence

Propriétaire — Lambdata © 2026
