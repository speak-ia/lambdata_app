# Déploiement — Vercel + Firebase + GCS

Stack cible validée pour Lambdata.

## Structure du dépôt

```
lambdata_app/          ← racine Git (ce repo)
├── web/               ← Next.js PWA → Vercel (Root Directory: web)
├── api/               ← NestJS → Cloud Run / Railway (plus tard)
```

> Pas de `vercel.json` à la racine : avec **Root Directory = `web`**, Vercel utilise les défauts Next.js (`npm install`, `npm run build`, sortie `.next`).

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
4. **Build and Output Settings** : laisser les **valeurs par défaut** (toggles désactivés) :
   - Install : `npm install`
   - Build : `npm run build`
   - Output : *(vide — Next.js gère `.next` automatiquement)*
   
   Ne pas utiliser `--prefix web` ni `web/.next` si la racine est déjà `web`.
5. Variables d’environnement (Preview + Production) :

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

### Déploiement bloqué (Hobby + `Co-authored-by: Cursor`)

Sur le plan **Hobby**, Vercel refuse les commits avec un co-auteur externe (`cursoragent@cursor.com`).

**Solutions :**

1. **Depuis votre terminal** (pas via l’agent) :
   ```bash
   git commit --allow-empty -m "chore: trigger Vercel production deploy"
   git push origin main
   ```
2. Ou **Deployments** → dernier déploiement **réussi** → menu **⋯** → **Redeploy** (sans sélectionner un commit Cursor).
3. Ne pas mettre de guillemets dans les variables Vercel ; **Redeploy** après correction.

CLI (optionnel) :

```bash
npx vercel link
npx vercel env pull web/.env.local
```

## 3. Firebase

1. [console.firebase.google.com](https://console.firebase.google.com) → créer projet **Lambdata**.
2. Activer **Authentication** : Email, Google (Phone activé côté Firebase pour plus tard — pas d’OTP SMS dans l’UI pour l’instant).
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

## 5. Implémentations code

- [x] SDK Firebase Auth dans `web/` (e-mail, Google, invité)
- [x] Guard Firebase Admin dans `api/` (`FIREBASE_AUTH_OPTIONAL=true` en dev sans clé service)
- [ ] Upload GCS / Firebase Storage (prochaine étape)
- [ ] Retirer MinIO en prod (garder docker-compose pour dev local)

### API — clé de compte de service (production)

1. Firebase Console → **Paramètres** → **Comptes de service** → **Générer une nouvelle clé privée**
2. Ne jamais committer le fichier JSON
3. Local : `FIREBASE_SERVICE_ACCOUNT_PATH=./chemin/vers/clé.json` dans `api/.env`
4. Vercel / Cloud Run : variable `FIREBASE_SERVICE_ACCOUNT_JSON` (contenu JSON sur une ligne)
5. Mettre `FIREBASE_AUTH_OPTIONAL=false` en production
