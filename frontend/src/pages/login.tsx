import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Audit fix: do NOT send a client-chosen role to the backend.
      // The backend returns the real role from DB; we trust THAT.
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || 'Identifiants invalides';
        throw new Error(message);
      }

      const data = await response.json();
      const actualRole = data.user.role; // trust the server, not the UI selector
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_role', actualRole);
      localStorage.setItem('user_type', actualRole); // legacy alias for older code paths
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_name', `${data.user.firstName} ${data.user.lastName}`);

      const redirectMap: Record<string, string> = {
        student: '/dashboard/student',
        parent: '/dashboard/parent',
        teacher: '/dashboard/teacher',
        admin: '/dashboard/admin',
      };
      window.location.href = redirectMap[actualRole] || '/';
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message.includes('Failed to fetch') ? 'Impossible de joindre le serveur.' : err.message);
      } else {
        setError('Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  const profiles = [
    { value: 'student', label: 'Élève' },
    { value: 'parent', label: 'Parent' },
    { value: 'teacher', label: 'Professeur' },
    { value: 'admin', label: 'Administrateur' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-panel font-sans" style={{ padding: 'var(--margin)' }}>
      <Head>
        <title>Portail Sécurisé | Le Flambeau</title>
      </Head>

      <FadeIn className="w-full" duration={0.4}>
        <div className="w-full max-w-[480px] mx-auto bg-paper border border-line">
          {/* En-tête */}
          <div className="border-b border-line" style={{ padding: 'var(--lh)' }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mono text-xs uppercase tracking-widest text-soft hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Retour au site
            </Link>
            <p className="kicker mt-6 mb-3">Portail sécurisé</p>
            <h1 className="text-ink" style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}>Connexion</h1>
            <p className="text-soft mt-3">Entrez vos accès pour ouvrir votre session.</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleLogin} style={{ padding: 'var(--lh)' }}>
            {/* Sélecteur de profil — tuiles plates */}
            <div className="mb-8">
              <label className="block mono text-xs uppercase tracking-widest text-soft mb-3">
                Type de Profil
              </label>
              <div className="grid grid-cols-2 gap-px bg-line border border-line">
                {profiles.map((p) => {
                  const selected = userType === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setUserType(p.value)}
                      aria-pressed={selected}
                      className={`px-4 py-4 text-left mono text-xs uppercase tracking-widest transition-colors ${
                        selected
                          ? 'bg-ink text-paper border-l-2 border-accent'
                          : 'bg-paper text-ink hover:text-accent'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email */}
            <div className="mb-8">
              <label className="block mono text-xs uppercase tracking-widest text-soft mb-3">
                Adresse Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nom@exemple.com"
              />
            </div>

            {/* Mot de passe */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="mono text-xs uppercase tracking-widest text-soft">
                  Mot de passe
                </label>
                <button
                  type="button"
                  className="mono text-xs uppercase tracking-widest text-accent hover:text-accent-ink transition-colors"
                >
                  Oublié ?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {/* Message d'erreur — plat */}
            {error && (
              <div className="mb-8 border-l-2 border-accent bg-panel px-4 py-3">
                <p className="mono text-xs uppercase tracking-widest text-accent">{error}</p>
              </div>
            )}

            {/* Soumission */}
            <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-50">
              {loading ? 'Connexion…' : 'Entrer dans le Portail'}
            </button>
          </form>

          {/* Pied — accès restreint */}
          <div className="border-t border-line" style={{ padding: 'var(--lh)' }}>
            <p className="mono text-xs uppercase tracking-widest text-soft mb-2">Accès restreint</p>
            <p className="text-soft text-sm">
              Si vous n'avez pas vos accès, veuillez contacter le secrétariat du collège.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
