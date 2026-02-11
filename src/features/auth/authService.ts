import { AuthenticatedUser, EmailSignInPayload } from './types';

export interface IAuthService {
  signInWithEmail(payload: EmailSignInPayload): Promise<AuthenticatedUser>;
  signInWithGoogle(): Promise<AuthenticatedUser>;
  signOut(): Promise<void>;
}

export class FirebaseAuthService implements IAuthService {
  async signInWithEmail(_payload: EmailSignInPayload): Promise<AuthenticatedUser> {
    throw new Error('Firebase email sign-in is not implemented yet.');
  }

  async signInWithGoogle(): Promise<AuthenticatedUser> {
    throw new Error('Firebase Google sign-in is not implemented yet.');
  }

  async signOut(): Promise<void> {
    throw new Error('Firebase sign-out is not implemented yet.');
  }
}
