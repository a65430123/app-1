/** 預留：會員登入（尚未實作） */
export interface AuthUser { id: string; displayName: string }
export interface AuthService {
  currentUser(): AuthUser | null;
  signIn(): Promise<AuthUser>;
  signOut(): Promise<void>;
}
export const authService: AuthService = {
  currentUser: () => null,
  signIn: () => Promise.reject(new Error('會員功能尚未開放')),
  signOut: () => Promise.resolve(),
};
