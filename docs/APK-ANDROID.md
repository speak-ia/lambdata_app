# Installer Lambdata comme une vraie app (icône Android)

Trois options, de la plus simple à la plus « native » :

## Option A — PWA (sans APK, 30 secondes)

1. Ouvrir `http://VOTRE_IP:3000` dans **Chrome** sur Android.
2. Menu ⋮ → **Installer l’application** ou **Ajouter à l’écran d’accueil**.
3. L’icône Lambdata apparaît comme les autres apps.

> Limité : pas sur le Play Store, comportement selon le navigateur.

---

## Option B — APK de développement (Capacitor) ✅ configuré

L’APK ouvre une **WebView** qui charge votre serveur Next.js (même UI que le web).

### Prérequis

- [Android Studio](https://developer.android.com/studio) (SDK + émulateur ou téléphone USB)
- JDK 17+
- Mac et téléphone sur le **même Wi‑Fi**
- `npm run dev` en cours sur le Mac

### Étapes

```bash
# 1. Vérifier l’IP du Mac
ipconfig getifaddr en0
# Exemple : 192.168.1.3

# 2. Fichier web/.env.local
NEXT_PUBLIC_API_URL=http://192.168.1.3:3001

# 3. Synchroniser l’app Android (URL du serveur web)
cd /Users/mohpython/Documents/lambdata_app
export CAPACITOR_SERVER_URL=http://192.168.1.3:3000
npm run android:sync

# 4. Ouvrir Android Studio et lancer l’app
npm run android:open
```

Dans Android Studio : **Run ▶** sur un émulateur ou un téléphone branché en USB (débogage USB activé).

### Générer un fichier `.apk` installable

Dans Android Studio :

**Build → Build Bundle(s) / APK(s) → Build APK(s)**

L’APK se trouve dans :

`web/android/app/build/outputs/apk/debug/app-debug.apk`

Copiez-le sur le téléphone (USB, AirDrop, Drive) et installez-le (autoriser « sources inconnues » si demandé).

> **Important** : l’APK dev pointe vers `http://192.168.1.3:3000`. Le Mac doit rester allumé avec `npm run dev`. Pour une app autonome, déployez le web en HTTPS et changez `CAPACITOR_SERVER_URL`.

---

## Option C — Play Store (production)

1. Déployer le web sur **HTTPS** (ex. Vercel : `https://app.lambdata.africa`).
2. Mettre `CAPACITOR_SERVER_URL` sur cette URL.
3. Build **AAB** signé (Android Studio → Generate Signed Bundle).
4. Publier sur Google Play Console.

---

## iOS (iPhone)

Même principe PWA : Safari → **Partager → Sur l’Écran d’accueil**.

Pour une app App Store : `npx cap add ios` (Mac + Xcode requis).

---

## Commandes utiles

| Commande | Action |
|----------|--------|
| `npm run android:sync` | Copie config + plugins vers Android |
| `npm run android:open` | Ouvre Android Studio |
| `npm run android:run` | Lance sur appareil/émulateur (CLI) |
| `npm run android:icons --prefix web` | Régénère les icônes depuis le logo |
