/**
 * Audit fix (P1-4): a single source of truth for the role key.
 *
 * Login stores `user_role` (canonical). For backward compat we also read the legacy
 * `user_type` if `user_role` is missing, but everything new should use `user_role`.
 */

export const ROLE_KEY = 'user_role';
export const TOKEN_KEY = 'auth_token';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ROLE_KEY) || window.localStorage.getItem('user_type');
};

// Backward-compat alias (some pages still call getUserType).
export const getUserType = getUserRole;

export const isAuthenticated = (): boolean => !!getAuthToken();

export const requireRole = (expectedRole: string): boolean => {
  return isAuthenticated() && getUserRole() === expectedRole;
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  ['auth_token', 'user_role', 'user_type', 'user_email', 'user_id', 'user_name'].forEach((k) =>
    window.localStorage.removeItem(k)
  );
  window.location.href = '/login';
};
