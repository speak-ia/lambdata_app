import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Mode « live » : l’APK charge l’app depuis votre serveur Next.js (dev ou prod).
 * Définir CAPACITOR_SERVER_URL avant `cap sync` (voir .env.mobile.example).
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ?? "http://192.168.1.3:3000";

const config: CapacitorConfig = {
  appId: "africa.lambdata.app",
  appName: "Lambdata",
  webDir: "public",
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith("http://"),
    androidScheme: "http",
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#000000",
      showSpinner: false,
    },
  },
};

export default config;
