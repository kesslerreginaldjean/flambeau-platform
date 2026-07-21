import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { ArrowRight, ArrowLeft } from 'lucide-react';

import { authFetch } from '@/lib/authFetch';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  level: string;
  message: string;
  birthCertificate: File | null;
  reportCard: File | null;
  identityPhotos: File | null;
  medicalCertificate: File | null;
};

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  level: '',
  message: '',
  birthCertificate: null,
  reportCard: null,
  identityPhotos: null,
  medicalCertificate: null,
};

// ============================================================
// Validation Zod — un schéma par étape
// ============================================================
const stepStudentSchema = z.object({
  firstName: z.string().trim().min(2, 'Le prénom est requis.'),
  lastName: z.string().trim().min(2, 'Le nom est requis.'),
  level: z.string().min(1, 'Veuillez choisir un niveau.'),
});

const stepParentSchema = z.object({
  email: z.string().trim().min(1, "L'email est requis.").email('Adresse email invalide.'),
  phone: z
    .string()
    .trim()
    .min(6, 'Numéro de téléphone invalide.')
    .regex(/^[+()\d\s-]+$/, 'Numéro de téléphone invalide.'),
  message: z.string().optional(),
});

const stepDocumentsSchema = z.object({
  birthCertificate: z.instanceof(File, { message: "L'acte de naissance est requis." }),
  reportCard: z.instanceof(File, { message: 'Le dernier bulletin est requis.' }),
  identityPhotos: z.instanceof(File, { message: "Les photos d'identité sont requises." }),
});

const stepSchemas = [stepStudentSchema, stepParentSchema, stepDocumentsSchema] as const;

const documents = [
  { name: 'birthCertificate', label: 'Acte de naissance', required: true },
  { name: 'reportCard', label: 'Dernier bulletin', required: true },
  { name: 'identityPhotos', label: "Photos d'identité", required: true },
  { name: 'medicalCertificate', label: 'Certificat médical', required: false },
] as const;

const stepLabels = [
  { n: '01', title: 'Infos élève' },
  { n: '02', title: 'Coordonnées parents' },
  { n: '03', title: 'Documents' },
  { n: '04', title: 'Confirmation' },
];

export default function Admissions() {
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [step, setStep] = useState(0); // 0..3
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [admissionId, setAdmissionId] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    const next = files ? (files[0] ?? null) : value;
    setFormData((prev) => ({ ...prev, [name]: next }));
    // Temps réel : on efface l'erreur du champ dès correction.
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _omit, ...rest } = prev;
        return rest;
      });
    }
  };

  // Valide l'étape courante ; renvoie true si valide, sinon pose les erreurs.
  const validateStep = (index: number): boolean => {
    if (index >= stepSchemas.length) return true; // étape 04 = récap, pas de schéma
    const schema = stepSchemas[index];
    const result = schema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, stepLabels.length - 1));
    }
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    // Filet de sécurité : revalide les étapes à champs requis avant POST.
    for (let i = 0; i < stepSchemas.length; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }

    setLoading(true);
    setSubmitError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value as string | Blob);
      });

      const response = await authFetch(`${apiUrl}/api/admissions`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      const result = await response.json().catch(() => ({}));
      setAdmissionId(result.admissionId ?? '—');
    } catch (error) {
      setSubmitError('Une erreur est survenue. Veuillez réessayer ou contacter le secrétariat.');
    } finally {
      setLoading(false);
    }
  };

  const errorText = (name: string) =>
    errors[name] ? <p className="text-accent text-xs mt-2">{errors[name]}</p> : null;

  // ============================================================
  // Panneau de confirmation après succès
  // ============================================================
  if (admissionId) {
    return (
      <div className="min-h-screen flex flex-col bg-paper">
        <SEO title="Dossier soumis" description="Votre demande d'admission a bien été reçue." />
        <Header />
        <main className="flex-1 pt-20">
          <section style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
            <div className="container">
              <div className="swiss-grid">
                <div className="col-span-12 lg:col-span-8">
                  <FadeIn>
                    <p className="kicker mb-4">Dossier reçu</p>
                    <h1 className="text-ink mb-6">Votre candidature a bien été soumise.</h1>
                    <p className="text-soft text-lg max-w-2xl mb-12">
                      Nous allons l'étudier avec attention et vous contacterons pour organiser un
                      entretien avec le secrétariat.
                    </p>

                    <div className="border border-line" style={{ padding: 'var(--lh)' }}>
                      <p className="mono text-xs uppercase tracking-widest text-soft mb-2">
                        Numéro de dossier
                      </p>
                      <p className="numeral text-accent text-4xl mb-8">{admissionId}</p>
                      <div className="pt-6 border-t border-line flex flex-wrap gap-4">
                        <Link href="/suivi" className="btn-accent">
                          Suivre mon dossier
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/" className="btn-secondary">
                          Retour à l'accueil
                        </Link>
                      </div>
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

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SEO
        title="Admission en ligne"
        description="Simplifiez l'avenir de votre enfant. Soumettez votre demande d'admission au Collège Le Flambeau directement en ligne en quelques minutes."
      />
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero — image-led band */}
        <section className="relative border-b border-line overflow-hidden">
          <motion.img
            src="/images/school_facade_wide.jpg"
            alt="Façade du Collège Le Flambeau"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(17,19,21,.72)' }} />
          <div
            className="container relative"
            style={{ paddingBlock: 'calc(var(--lh) * 4)' }}
          >
            <FadeIn>
              <div className="swiss-grid items-end">
                <div className="col-span-12 lg:col-span-8">
                  <p className="kicker mb-4" style={{ color: 'rgba(255,255,255,.7)' }}>
                    Inscriptions 2026–2027
                  </p>
                  <h1 className="mb-6" style={{ color: '#ffffff' }}>
                    Préparez le futur dès aujourd'hui.
                  </h1>
                  <p className="text-lg max-w-2xl" style={{ color: 'rgba(255,255,255,.82)' }}>
                    Un processus d'admission simple, transparent et entièrement numérisé pour votre
                    confort.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            {/* Indicateur d'étapes */}
            <FadeIn>
              <div className="border-t border-ink pt-6 mb-4">
                <div className="swiss-grid">
                  {stepLabels.map((s, i) => {
                    const isActive = i === step;
                    const isDone = i < step;
                    return (
                      <div key={s.n} className="col-span-6 md:col-span-3">
                        <div
                          className={`border-t pt-3 ${isActive ? 'border-accent' : 'border-line'}`}
                        >
                          <span
                            className={`numeral text-3xl ${
                              isActive ? 'text-accent' : isDone ? 'text-ink' : 'text-soft'
                            }`}
                          >
                            {s.n}
                          </span>
                          <p
                            className={`mono text-xs uppercase tracking-wider mt-2 ${
                              isActive ? 'text-ink' : 'text-soft'
                            }`}
                          >
                            {isDone ? '— ' : ''}
                            {s.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>

            <div className="mb-12">
              <Link
                href="/suivi"
                className="mono text-xs uppercase tracking-widest text-accent inline-flex items-center gap-1"
              >
                Suivre mon dossier
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="swiss-grid">
              <div className="col-span-12 lg:col-span-8">
                <FadeIn>
                  <div className="border border-line rounded-lg" style={{ padding: 'var(--lh)' }}>
                    {/* ---------- Étape 01 — Infos élève ---------- */}
                    {step === 0 && (
                      <div>
                        <p className="kicker mb-4">Étape 01</p>
                        <h2 className="text-ink mb-10">Informations de l'élève</h2>
                        <div className="swiss-grid">
                          <div className="col-span-12 md:col-span-6">
                            <label
                              htmlFor="firstName"
                              className="mono text-xs uppercase tracking-widest text-soft block mb-2"
                            >
                              Prénom de l'élève
                            </label>
                            <input
                              id="firstName"
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="Ex: Jean"
                            />
                            {errorText('firstName')}
                          </div>
                          <div className="col-span-12 md:col-span-6">
                            <label
                              htmlFor="lastName"
                              className="mono text-xs uppercase tracking-widest text-soft block mb-2"
                            >
                              Nom de l'élève
                            </label>
                            <input
                              id="lastName"
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="Ex: Durand"
                            />
                            {errorText('lastName')}
                          </div>
                          <div className="col-span-12">
                            <label
                              htmlFor="level"
                              className="mono text-xs uppercase tracking-widest text-soft block mb-2"
                            >
                              Niveau souhaité
                            </label>
                            <select
                              id="level"
                              name="level"
                              value={formData.level}
                              onChange={handleChange}
                            >
                              <option value="">Choisissez un niveau</option>
                              <optgroup label="Le Jardin Vert de Cassandre">
                                <option value="1ère Maternelle">1ère Année Maternelle</option>
                                <option value="2ème Maternelle">2ème Année Maternelle</option>
                                <option value="3ème Maternelle">3ème Année Maternelle</option>
                              </optgroup>
                              <optgroup label="Cycle Fondamental">
                                <option value="1ère AF">1ère AF</option>
                                <option value="2ème AF">2ème AF</option>
                                <option value="3ème AF">3ème AF</option>
                                <option value="4ème AF">4ème AF</option>
                                <option value="5ème AF">5ème AF</option>
                                <option value="6ème AF">6ème AF</option>
                                <option value="7ème AF">7ème AF</option>
                                <option value="8ème AF">8ème AF</option>
                                <option value="9ème AF">9ème AF</option>
                              </optgroup>
                              <optgroup label="Nouveau Secondaire">
                                <option value="NS1">NS1</option>
                                <option value="NS2">NS2</option>
                                <option value="NS3">NS3</option>
                                <option value="NS4 (Terminale)">NS4 (Terminale)</option>
                              </optgroup>
                            </select>
                            {errorText('level')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---------- Étape 02 — Coordonnées parents ---------- */}
                    {step === 1 && (
                      <div>
                        <p className="kicker mb-4">Étape 02</p>
                        <h2 className="text-ink mb-10">Coordonnées des parents</h2>
                        <div className="swiss-grid">
                          <div className="col-span-12 md:col-span-6">
                            <label
                              htmlFor="email"
                              className="mono text-xs uppercase tracking-widest text-soft block mb-2"
                            >
                              Email du tuteur
                            </label>
                            <input
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="email@exemple.com"
                            />
                            {errorText('email')}
                          </div>
                          <div className="col-span-12 md:col-span-6">
                            <label
                              htmlFor="phone"
                              className="mono text-xs uppercase tracking-widest text-soft block mb-2"
                            >
                              Téléphone
                            </label>
                            <input
                              id="phone"
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+509 0000-0000"
                            />
                            {errorText('phone')}
                          </div>
                          <div className="col-span-12">
                            <label
                              htmlFor="message"
                              className="mono text-xs uppercase tracking-widest text-soft block mb-2"
                            >
                              Message (optionnel)
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows={4}
                              placeholder="Une information à transmettre au secrétariat ?"
                            />
                            {errorText('message')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---------- Étape 03 — Documents ---------- */}
                    {step === 2 && (
                      <div>
                        <p className="kicker mb-4">Étape 03</p>
                        <h2 className="text-ink mb-6">Pièces justificatives</h2>
                        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-6">
                          <p className="mono text-xs uppercase tracking-widest text-accent">
                            Pièces jointes obligatoires
                          </p>
                          <p className="mono text-xs uppercase tracking-wider text-soft">
                            JPG, PNG, PDF, max 5MB
                          </p>
                        </div>
                        <div className="swiss-grid">
                          {documents.map((doc) => {
                            const file = (formData as any)[doc.name] as File | null;
                            return (
                              <div key={doc.name} className="col-span-12 md:col-span-6">
                                <label
                                  htmlFor={doc.name}
                                  className={`flex flex-col justify-center w-full h-24 border cursor-pointer px-4 transition-colors ${
                                    errors[doc.name]
                                      ? 'border-accent'
                                      : file
                                      ? 'border-accent'
                                      : 'border-line hover:border-ink'
                                  }`}
                                >
                                  <span className="mono text-xs uppercase tracking-wider text-soft mb-1">
                                    {doc.label} {doc.required ? '*' : ''}
                                  </span>
                                  <span
                                    className={`text-sm truncate ${
                                      file ? 'text-accent' : 'text-soft'
                                    }`}
                                  >
                                    {file ? file.name : 'Sélectionner un fichier'}
                                  </span>
                                  <input
                                    id={doc.name}
                                    type="file"
                                    name={doc.name}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleChange}
                                  />
                                </label>
                                {errorText(doc.name)}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ---------- Étape 04 — Confirmation ---------- */}
                    {step === 3 && (
                      <div>
                        <p className="kicker mb-4">Étape 04</p>
                        <h2 className="text-ink mb-10">Vérification du dossier</h2>

                        <dl className="space-y-0">
                          {[
                            { k: 'Prénom', v: formData.firstName },
                            { k: 'Nom', v: formData.lastName },
                            { k: 'Niveau', v: formData.level },
                            { k: 'Email', v: formData.email },
                            { k: 'Téléphone', v: formData.phone },
                            { k: 'Message', v: formData.message || '—' },
                          ].map((row) => (
                            <div
                              key={row.k}
                              className="flex justify-between gap-4 py-3 border-t border-line"
                            >
                              <dt className="mono text-xs uppercase tracking-wider text-soft">
                                {row.k}
                              </dt>
                              <dd className="text-ink text-sm text-right">{row.v}</dd>
                            </div>
                          ))}
                          {documents.map((doc) => {
                            const file = (formData as any)[doc.name] as File | null;
                            return (
                              <div
                                key={doc.name}
                                className="flex justify-between gap-4 py-3 border-t border-line"
                              >
                                <dt className="mono text-xs uppercase tracking-wider text-soft">
                                  {doc.label}
                                </dt>
                                <dd
                                  className={`text-sm text-right truncate ${
                                    file ? 'text-ink' : 'text-soft'
                                  }`}
                                >
                                  {file ? file.name : '—'}
                                </dd>
                              </div>
                            );
                          })}
                        </dl>

                        {submitError && (
                          <p className="text-accent text-sm mt-6 border-t border-line pt-4">
                            {submitError}
                          </p>
                        )}
                      </div>
                    )}

                    {/* ---------- Navigation ---------- */}
                    <div className="mt-10 pt-6 border-t border-line flex flex-wrap gap-4 justify-between">
                      {step > 0 ? (
                        <button type="button" onClick={back} className="btn-secondary">
                          <ArrowLeft className="w-4 h-4" />
                          Précédent
                        </button>
                      ) : (
                        <span />
                      )}

                      {step < stepLabels.length - 1 ? (
                        <button type="button" onClick={next} className="btn-accent">
                          Suivant
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={loading}
                          className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Soumission en cours...' : 'Envoyer mon dossier'}
                          {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Colonne latérale — dossier requis */}
              <div className="col-span-12 lg:col-span-4">
                <FadeIn>
                  <div className="relative overflow-hidden rounded-lg border border-line group mb-6">
                    <motion.img
                      src="/images/school_vision.jpg"
                      alt="Le campus du Collège Le Flambeau"
                      className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ height: 'calc(var(--lh) * 9)' }}
                      initial={{ scale: 1.06 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                    />
                  </div>
                </FadeIn>
                <FadeIn>
                  <div className="border border-line" style={{ padding: 'var(--lh)' }}>
                    <p className="mono text-xs uppercase tracking-widest text-soft mb-6">
                      Dossier de candidature
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Acte de naissance',
                        'Dernier bulletin scolaire',
                        "Photos d'identité",
                        'Certificat médical',
                      ].map((p) => (
                        <li
                          key={p}
                          className="mono text-xs uppercase tracking-wider text-ink flex gap-2"
                        >
                          <span className="text-accent">—</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-line">
                      <p className="text-soft text-xs">
                        Vos données sont protégées et traitées avec confidentialité.
                      </p>
                    </div>
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
