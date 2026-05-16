export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('auth_token');
};

export const getUserType = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('user_type');
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('auth_token');
  window.localStorage.removeItem('user_type');
  window.location.href = '/login';
};

export const requireRole = (expectedRole: string) => {
  const token = getAuthToken();
  const role = getUserType();
  return token && role === expectedRole;
};
