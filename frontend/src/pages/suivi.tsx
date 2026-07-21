import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { ArrowRight } from 'lucide-react';

type Admission = {
  studentFirstName: string;
  studentLastName: string;
  level: string;
  status: 'NEW' | 'TEST_SCHEDULED' | 'TEST_TAKEN' | 'VALIDATED' | 'REJECTED' | string;
  testDate?: string | null;
  studentNumber?: string | null;
  createdAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  NEW: 'Reçu',
  TEST_SCHEDULED: 'Examen planifié',
  TEST_TAKEN: 'Examen passé',
  VALIDATED: 'Admis',
  REJECTED: 'Non retenu',
};

const formatDate = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function Suivi() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [admissions, setAdmissions] = useState<Admission[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Veuillez saisir une adresse email.');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/admissions/track?email=${encodeURIComponent(trimmed)}`
      );

      if (!response.ok) {
        throw new Error('request_failed');
      }

      const data = await response.json();
      setAdmissions(Array.isArray(data.admissions) ? data.admissions : []);
      setSearched(true);
    } catch (err) {
      setError('Une erreur est survenue. Vérifiez votre saisie et réessayez.');
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SEO
        title="Suivi de dossier"
        description="Suivez l'état de votre demande d'admission au Collège Le Flambeau avec votre adresse email."
      />
      <Header />

      <main className="flex-1 pt-20">
        {/* Masthead */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn>
              <div className="swiss-grid items-end">
                <div className="col-span-12 lg:col-span-8">
                  <p className="kicker mb-4">Admissions · Le Flambeau</p>
                  <h1 className="text-ink mb-6">Suivi de dossier</h1>
                  <p className="text-soft text-lg max-w-2xl">
                    Renseignez l'adresse email utilisée lors de votre candidature pour consulter
                    l'état de votre dossier.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid">
              <div className="col-span-12 lg:col-span-8">
                {/* Recherche */}
                <FadeIn>
                  <form onSubmit={handleSearch} className="mb-12">
                    <label
                      htmlFor="track-email"
                      className="mono text-xs uppercase tracking-widest text-soft block mb-2"
                    >
                      Adresse email
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[240px]">
                        <input
                          id="track-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="email@exemple.com"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Recherche...' : 'Consulter'}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                    {error && <p className="text-accent text-xs mt-3">{error}</p>}
                  </form>
                </FadeIn>

                {/* Résultats */}
                {searched && !error && (
                  <FadeIn>
                    {admissions.length === 0 ? (
                      <div className="border-t border-ink pt-6">
                        <p className="text-soft text-sm">
                          Aucun dossier trouvé pour cet email.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-between border-t border-ink pt-4 mb-6">
                          <p className="kicker">Dossiers</p>
                          <span className="numeral text-accent text-2xl">
                            {String(admissions.length).padStart(2, '0')}
                          </span>
                        </div>

                        <div>
                          {admissions.map((a, i) => {
                            const label = STATUS_LABEL[a.status] ?? a.status;
                            return (
                              <div
                                key={`${a.studentFirstName}-${a.studentLastName}-${i}`}
                                className="border-t border-line py-6"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div>
                                    <h3 className="text-ink mb-1">
                                      {a.studentFirstName} {a.studentLastName}
                                    </h3>
                                    <p className="mono text-xs uppercase tracking-wider text-soft">
                                      {a.level}
                                    </p>
                                  </div>
                                  <span
                                    className={`mono text-xs uppercase tracking-widest border px-3 py-1 ${
                                      a.status === 'VALIDATED'
                                        ? 'border-accent text-accent'
                                        : a.status === 'REJECTED'
                                        ? 'border-line text-soft'
                                        : 'border-ink text-ink'
                                    }`}
                                  >
                                    {label}
                                  </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-x-12 gap-y-2">
                                  <div>
                                    <p className="mono text-xs uppercase tracking-wider text-soft mb-1">
                                      Déposé le
                                    </p>
                                    <p className="mono text-sm text-ink">
                                      {formatDate(a.createdAt) || '—'}
                                    </p>
                                  </div>

                                  {a.status === 'TEST_SCHEDULED' && a.testDate && (
                                    <div>
                                      <p className="mono text-xs uppercase tracking-wider text-soft mb-1">
                                        Date d'examen
                                      </p>
                                      <p className="mono text-sm text-ink">
                                        {formatDate(a.testDate)}
                                      </p>
                                    </div>
                                  )}

                                  {a.status === 'VALIDATED' && a.studentNumber && (
                                    <div>
                                      <p className="mono text-xs uppercase tracking-wider text-soft mb-1">
                                        Matricule
                                      </p>
                                      <p className="numeral text-accent text-xl">
                                        {a.studentNumber}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          <div className="border-t border-line" />
                        </div>
                      </div>
                    )}
                  </FadeIn>
                )}
              </div>

              {/* Colonne latérale */}
              <div className="col-span-12 lg:col-span-4">
                <FadeIn>
                  <div className="border border-line" style={{ padding: 'var(--lh)' }}>
                    <p className="mono text-xs uppercase tracking-widest text-soft mb-4">
                      Pas encore candidat ?
                    </p>
                    <p className="text-soft text-sm mb-6">
                      Déposez votre demande d'admission en ligne en quelques minutes.
                    </p>
                    <Link href="/admissions" className="btn-secondary w-full">
                      Demander une admission
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
