import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="bg-paper border-b border-line" style={{ paddingTop: 'calc(var(--lh) * 6)' }}>
      <div className="container">
        <div className="swiss-grid items-end" style={{ paddingBottom: 'calc(var(--lh) * 3)' }}>
          {/* Left — masthead, flush-left, columns 1–7 */}
          <div className="col-span-12 lg:col-span-7">
            <p className="kicker mb-6">Institution d’excellence académique · Haïti</p>

            <h1 className="text-ink">
              Une École,
              <br />
              <span className="text-accent">Une Vision.</span>
            </h1>

            <hr className="rule mt-8 mb-8" style={{ maxWidth: '88px', borderTopWidth: '3px', borderTopColor: 'var(--accent)' }} />

            <p className="text-soft text-lg max-w-xl">
              Depuis sa fondation, le Collège Le Flambeau se consacre à la formation
              intégrale de la jeunesse haïtienne — alliant discipline, savoir et innovation.
            </p>

            <p className="mono text-sm text-soft mt-6">« Mieux choisir pour réussir »</p>

            <div className="flex flex-col sm:flex-row gap-0 sm:gap-px mt-10">
              <Link href="/admissions" className="btn-accent group">
                Inscriptions ouvertes
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="btn-secondary">
                Notre histoire
              </Link>
            </div>

            {/* Accreditation row */}
            <div className="flex flex-wrap gap-x-10 gap-y-2 mt-12 pt-6 border-t border-line">
              <span className="mono text-xs uppercase tracking-widest text-soft">Accrédité MENFP</span>
              <span className="mono text-xs uppercase tracking-widest text-soft">Cycles complets</span>
              <span className="mono text-xs uppercase tracking-widest text-soft">Maternelle → Bac</span>
            </div>
          </div>

          {/* Right — image in a module, sharp edges, columns 8–12 */}
          <div className="col-span-12 lg:col-span-5">
            <figure className="relative">
              <img
                src="/images/school_facade_close.jpg"
                alt="Collège Le Flambeau"
                className="w-full object-cover border border-line"
                style={{ height: 'calc(var(--lh) * 18)' }}
              />
              <figcaption className="mono text-xs text-soft mt-2 flex justify-between">
                <span>Fig. 01 — Façade</span>
                <span>Port-au-Prince</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
