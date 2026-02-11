export type AuthProvider = 'google' | 'email';

export type AuthenticatedUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  provider: AuthProvider;
};

export type EmailSignInPayload = {
  email: string;
  password: string;
};

export type AuthState = {
  currentUser: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
};
