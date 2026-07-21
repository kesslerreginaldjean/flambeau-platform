/**
 * Centralised environment-variable loading and validation.
 *
 * - Fail-fast in production if a required secret is missing.
 * - Refuse known-weak default values that used to be hard-coded in the codebase
 *   (`dev-secret`, `flambeau-super-secret-key`, …).
 * - Expose typed `env` object so callers never read process.env directly.
 *
 * Audit reference: P0-2 (remove `dev-secret` fallback, force `JWT_SECRET`).
 */

import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const WEAK_SECRETS = new Set<string>([
  'dev-secret',
  'flambeau-super-secret-key',
  'your-super-secret-jwt-key-change-in-production',
  'changeme',
  'secret',
  'password',
  '',
]);

function readSecret(name: string, opts: { minLength?: number; allowMissingInDev?: boolean } = {}): string {
  const { minLength = 32, allowMissingInDev = true } = opts;
  const raw = process.env[name];

  if (!raw || raw.trim() === '') {
    if (isProd) {
      throw new Error(`[env] ${name} is required in production. Set it in your environment before starting the server.`);
    }
    if (!allowMissingInDev) {
      throw new Error(`[env] ${name} is required.`);
    }
    // Generate a per-process random secret in dev so the app still boots,
    // but never reuse the legacy weak default.
    const randomDev = require('crypto').randomBytes(48).toString('hex');
    // eslint-disable-next-line no-console
    console.warn(`[env] ${name} not set — using a random per-process value (DEV ONLY). Tokens will not survive restart.`);
    return randomDev;
  }

  if (WEAK_SECRETS.has(raw.trim().toLowerCase())) {
    throw new Error(`[env] ${name} is set to a known-weak default ("${raw}"). Generate a strong random value (e.g. \`openssl rand -hex 48\`).`);
  }

  if (raw.length < minLength) {
    const msg = `[env] ${name} is shorter than ${minLength} chars. Use a strong random secret.`;
    if (isProd) throw new Error(msg);
    // eslint-disable-next-line no-console
    console.warn(msg);
  }

  return raw;
}

function readString(name: string, fallback?: string): string {
  const v = process.env[name];
  if (v && v.trim() !== '') return v;
  if (fallback !== undefined) return fallback;
  if (isProd) throw new Error(`[env] ${name} is required in production.`);
  return '';
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  isProd,
  PORT: Number(process.env.PORT ?? 5000),

  JWT_SECRET: readSecret('JWT_SECRET'),
  JWT_EXPIRES_IN: readString('JWT_EXPIRES_IN', '2h'),
  BCRYPT_COST: Number(process.env.BCRYPT_COST ?? 12),

  FRONTEND_URL: readString('FRONTEND_URL', isProd ? '' : 'http://localhost:3000'),

  // Kotelam — only required if PAYMENTS_ENABLED=true
  PAYMENTS_ENABLED: process.env.PAYMENTS_ENABLED === 'true',
  KOTELAM_API_KEY: process.env.KOTELAM_API_KEY ?? '',
  KOTELAM_API_URL: process.env.KOTELAM_API_URL ?? '',
  KOTELAM_MERCHANT_ID: process.env.KOTELAM_MERCHANT_ID ?? '',
  KOTELAM_WEBHOOK_SECRET: process.env.KOTELAM_WEBHOOK_SECRET ?? '',

  // Gemini — only required if AI_ENABLED=true (default off)
  AI_ENABLED: process.env.AI_ENABLED === 'true',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
};

// Hard guards in production
if (env.isProd) {
  if (env.PAYMENTS_ENABLED && (!env.KOTELAM_API_KEY || !env.KOTELAM_MERCHANT_ID || !env.KOTELAM_WEBHOOK_SECRET)) {
    throw new Error('[env] PAYMENTS_ENABLED=true requires KOTELAM_API_KEY, KOTELAM_MERCHANT_ID and KOTELAM_WEBHOOK_SECRET.');
  }
  if (env.AI_ENABLED && !env.GEMINI_API_KEY) {
    throw new Error('[env] AI_ENABLED=true requires GEMINI_API_KEY.');
  }
  if (!env.FRONTEND_URL) {
    throw new Error('[env] FRONTEND_URL is required in production (used for CORS whitelist).');
  }
}
