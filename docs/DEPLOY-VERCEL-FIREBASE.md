# Déploiement — Vercel + Firebase + GCS

Stack cible validée pour Lambdata.

## Structure du dépôt

```
lambdata_app/          ← racine Git (ce repo)
├── web/               ← Next.js PWA → Vercel (Root Directory: web)
├── api/               ← NestJS → Cloud Run / Railway (plus tard)
└── vercel.json        ← aide CI (optionnel si Root = web dans le dashboard)
```

## 1. GitHub

Repo : https://github.com/speak-ia/lambdata_app

```bash
git remote add origin https://github.com/speak-ia/lambdata_app.git
git push -u origin main
```

## 2. Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → importer `speak-ia/lambdata_app`.
2. **Root Directory** : `web`
3. Framework : Next.js (auto-détecté)
4. Variables d’environnement (Preview + Production) :

| Variable | Exemple |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | URL de l’API (plus tard Cloud Run) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Depuis console Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `xxx.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `lambdata-xxx` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `xxx.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | … |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | … |

5. Deploy → URL preview du type `lambdata-app-xxx.vercel.app`

CLI (optionnel) :

```bash
npx vercel link
npx vercel env pull web/.env.local
```

## 3. Firebase

1. [console.firebase.google.com](https://console.firebase.google.com) → créer projet **Lambdata**.
2. Activer **Authentication** : Google, Email, Phone (OTP).
3. Activer **Storage** (bucket GCS lié).
4. Ajouter une app **Web** → copier la config dans les variables Vercel ci-dessus.
5. **Authorized domains** : ajouter `localhost`, votre domaine Vercel, et le domaine custom futur.

Émulateurs locaux (prochaine phase dev) :

```bash
firebase init emulators
```

## 4. API NestJS (hors Vercel)

- Reste sur `api/` — déploiement séparé (Cloud Run recommandé avec GCP + Firebase).
- `CORS_ORIGIN` : URL Vercel production + previews (`https://*.vercel.app` si besoin).
- Vérification des tokens : **Firebase Admin SDK** dans NestJS.

## 5. Prochaines implémentations code

- [ ] SDK Firebase Auth dans `web/`
- [ ] Guard Firebase Admin dans `api/`
- [ ] Upload GCS / Firebase Storage
- [ ] Retirer MinIO en prod (garder docker-compose pour dev local)
