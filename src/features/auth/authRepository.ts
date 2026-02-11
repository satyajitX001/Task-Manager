import { IAuthService, FirebaseAuthService } from './authService';
import { AuthenticatedUser, EmailSignInPayload } from './types';

export interface IAuthRepository {
  signInWithEmail(payload: EmailSignInPayload): Promise<AuthenticatedUser>;
  signInWithGoogle(): Promise<AuthenticatedUser>;
  signOut(): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
  constructor(private readonly authService: IAuthService) {}

  signInWithEmail(payload: EmailSignInPayload) {
    return this.authService.signInWithEmail(payload);
  }

  signInWithGoogle() {
    return this.authService.signInWithGoogle();
  }

  signOut() {
    return this.authService.signOut();
  }
}

export const authRepository = new AuthRepository(new FirebaseAuthService());
