# Lambdata sur iPhone (icône + app)

## Option A — PWA Safari (recommandé pour tester, 1 minute)

C’est l’équivalent Android « Ajouter à l’écran d’accueil ».

1. Sur l’iPhone, connecté au **même Wi‑Fi** que le Mac.
2. Ouvrir **Safari** (pas Chrome — sur iOS seul Safari installe bien la PWA).
3. Aller à : `http://192.168.1.3:3000` (remplacez par l’IP de votre Mac).
4. Bouton **Partager** (carré avec flèche vers le haut).
5. **Sur l’écran d’accueil** → Ajouter.

L’icône **Lambdata** apparaît sur l’écran d’accueil. L’app s’ouvre en plein écran, sans barre Safari.

### Vérifications

- `web/.env.local` : `NEXT_PUBLIC_API_URL=http://192.168.1.3:3001`
- `npm run dev` actif sur le Mac
- IP du Mac : `ipconfig getifaddr en0`

### Limites iOS (PWA)

- Pas sur l’App Store
- Notifications push limitées vs app native
- Micro / caméra : parfois plus stricts qu’en APK ; en prod **HTTPS** est fortement recommandé

---

## Option B — App native Xcode (Capacitor) ✅ configuré

Même principe que l’APK Android : une app iOS avec icône Lambdata qui charge votre serveur Next.js.

### Prérequis

- **Mac** avec [Xcode](https://developer.apple.com/xcode/) installé
- Compte Apple (gratuit suffit pour installer sur **votre** iPhone)
- iPhone et Mac sur le même Wi‑Fi
- `npm run dev` en cours

### Étapes

```bash
# Terminal 1
cd /Users/mohpython/Documents/lambdata_app
npm run dev

# Terminal 2
export CAPACITOR_SERVER_URL=http://192.168.1.3:3000
npm run ios:open
```

Dans **Xcode** :

1. Ouvrir le projet `web/ios/App/App.xcworkspace` (ou via la commande ci-dessus).
2. En haut : choisir votre **iPhone** (branché USB ou même Apple ID en wireless debugging).
3. **Signing & Capabilities** → Team : votre compte Apple personnel.
4. Bouton **Run ▶**.

L’app s’installe sur l’iPhone avec l’icône Lambdata.

> En mode dev, le Mac doit rester allumé avec le serveur Next.js, comme pour l’APK Android.

---

## Option C — App Store / TestFlight (production)

1. Déployer le web en **HTTPS** (obligatoire Apple pour la prod).
2. `CAPACITOR_SERVER_URL=https://votre-domaine.com`
3. `npm run ios:sync`
4. Xcode → **Product → Archive** → App Store Connect / TestFlight.
5. Compte **Apple Developer** payant (99 USD/an) requis pour publier sur l’App Store.

---

## Comparaison rapide

| Méthode | Icône | App Store | Mac + serveur dev |
|---------|--------|-----------|-------------------|
| Safari → Écran d’accueil | ✅ | ❌ | Oui (Wi‑Fi) |
| Xcode / Capacitor | ✅ | ❌ (sauf compte dev) | Oui en mode dev |
| TestFlight / App Store | ✅ | ✅ | Non (HTTPS prod) |

---

## Commandes

| Commande | Action |
|----------|--------|
| `npm run ios:sync` | Sync config Capacitor → projet iOS |
| `npm run ios:open` | Ouvre Xcode |
| `npm run ios:run` | Build + lance sur appareil (CLI) |
| `npm run ios:icons --prefix web` | Régénère icônes iOS |
