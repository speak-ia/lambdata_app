import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";
import { readFileSync } from "fs";

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private ready = false;

  onModuleInit() {
    if (admin.apps.length > 0) {
      this.ready = true;
      return;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
      this.logger.warn(
        "FIREBASE_PROJECT_ID absent — vérification des tokens désactivée (mode dev).",
      );
      return;
    }

    try {
      const credential = this.resolveCredential();
      admin.initializeApp({
        projectId,
        credential,
      });
      this.ready = true;
      this.logger.log("Firebase Admin initialisé");
    } catch (error) {
      this.logger.error("Firebase Admin non initialisé", error);
    }
  }

  private resolveCredential(): admin.credential.Credential {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (json) {
      const parsed = JSON.parse(json) as admin.ServiceAccount;
      return admin.credential.cert(parsed);
    }

    const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (path) {
      const parsed = JSON.parse(
        readFileSync(path, "utf8"),
      ) as admin.ServiceAccount;
      return admin.credential.cert(parsed);
    }

    return admin.credential.applicationDefault();
  }

  isEnabled(): boolean {
    return this.ready;
  }

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    if (!this.ready) {
      throw new Error("Firebase Admin non configuré");
    }
    return admin.auth().verifyIdToken(token);
  }
}
