/**
 * Minimal fetch wrapper that:
 *  - resolves the API base URL from NEXT_PUBLIC_API_URL,
 *  - automatically attaches the Bearer token from localStorage,
 *  - on 401 clears credentials and redirects to /login.
 *
 * Audit P1-4: replaces the dozens of hard-coded `fetch('http://localhost:5000/...')`
 * calls across the dashboard pages.
 *
 * Drop-in: the second arg keeps fetch's RequestInit, so callers don't change.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  // Allow callers to pass either a relative path "/api/foo" or a legacy
  // "http://localhost:5000/api/foo" (post-audit cleanup of hard-codes).
  let url = input;
  if (url.startsWith('http://localhost:5000')) {
    url = API_URL + url.slice('http://localhost:5000'.length);
  } else if (url.startsWith('/')) {
    url = API_URL + url;
  }

  const headers = new Headers(init.headers || {});
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('auth_token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  // Only set JSON content-type if a body is provided AND no FormData.
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401 && typeof window !== 'undefined') {
    ['auth_token', 'user_role', 'user_type', 'user_email', 'user_id', 'user_name'].forEach(k =>
      window.localStorage.removeItem(k)
    );
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }

  return res;
}

export default authFetch;
