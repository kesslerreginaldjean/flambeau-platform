import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './lib/env';
import { uploadsHandler } from './middleware/uploadsAuth';

const app = express();

// --- Security headers (audit P1-1) ---
app.use(helmet({
  // Allow images from the API itself; the rest is locked down.
  contentSecurityPolicy: env.isProd ? undefined : false,
  crossOriginResourcePolicy: { policy: 'same-site' },
}));

// --- CORS: whitelist instead of wide-open (audit P1-1) ---
const allowedOrigins = [env.FRONTEND_URL].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    // Allow same-origin / curl (no Origin header) in dev only.
    if (!origin) return cb(null, !env.isProd);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Origine non autorisée'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// --- Body parsers ---
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// --- Trust proxy when behind a reverse proxy (required for accurate rate-limit IPs) ---
if (env.isProd) app.set('trust proxy', 1);

// --- Global rate limit (audit P1-1) ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// --- Auth-specific rate limit: tighter, to slow brute-force on /login & /register ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives. Réessayez plus tard.' },
});

// --- Protected static uploads (audit P0-7) ---
app.use('/uploads', uploadsHandler);

// --- Routers ---
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import parentRoutes from './routes/parents';
import teacherRoutes from './routes/teachers';
import adminRoutes from './routes/admin';
import admissionsRoutes from './routes/admissions';
import aiRoutes from './routes/ai';
import communicationRoutes from './routes/communication';
import publicRoutes from './routes/public';

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/public', publicRoutes);

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', env: env.NODE_ENV, timestamp: new Date().toISOString() });
});

// --- 404 ---
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// --- Error handler (audit: never leak stack traces in prod) ---
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err?.stack ?? err);
  res.status(err.status || 500).json({
    error: env.isProd ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
  });
});

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

export default app;
