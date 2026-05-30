import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { FirebaseAdminService } from "./firebase-admin.service";

export type AuthenticatedRequest = {
  headers: { authorization?: string };
  firebaseUid?: string;
  firebaseEmail?: string;
};

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      if (process.env.FIREBASE_AUTH_OPTIONAL === "true") {
        return true;
      }
      throw new UnauthorizedException("Token manquant");
    }

    if (!this.firebaseAdmin.isEnabled()) {
      if (process.env.FIREBASE_AUTH_OPTIONAL === "true") {
        return true;
      }
      throw new UnauthorizedException("Auth serveur non configurée");
    }

    const token = header.slice(7);
    try {
      const decoded = await this.firebaseAdmin.verifyIdToken(token);
      request.firebaseUid = decoded.uid;
      request.firebaseEmail = decoded.email;
      return true;
    } catch {
      throw new UnauthorizedException("Token invalide ou expiré");
    }
  }
}
