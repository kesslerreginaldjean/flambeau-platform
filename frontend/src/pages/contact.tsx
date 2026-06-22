'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Message envoyé:', formData);
    alert('Merci! Votre message a été reçu. Nous vous recontacterons très bientôt.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const coordonnees = [
    { icon: Phone, title: 'Téléphone', text: '+509 2813 1415 / 2813 1416', sub: 'Lundi – Vendredi, 8h – 16h' },
    { icon: Mail, title: 'Courriel', text: 'informations@collegeflambeau.edu', sub: 'Réponse sous 24h ouvrées' },
    { icon: MapPin, title: 'Adresse', text: '#11, Delmas 31', sub: 'Rue Alexandre Dumas, Port-au-Prince' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 pt-20">
        {/* En-tête — image-led hero */}
        <section className="relative overflow-hidden border-b border-line">
          <img
            src="/images/school_facade_close.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(17,19,21,.86), rgba(17,19,21,.62))' }}
          />
          <div className="container relative" style={{ paddingBlock: 'calc(var(--lh) * 5)' }}>
            <div className="swiss-grid items-end">
              <FadeIn className="col-span-12 lg:col-span-9">
                <p className="kicker mb-4" style={{ color: 'var(--accent)' }}>Contactez-nous</p>
                <h1 className="text-paper">Nous sommes à votre écoute</h1>
                <p className="text-white/70 text-lg max-w-xl mt-6">
                  Une question sur les admissions, la scolarité ou la vie au Collège ?
                  Notre équipe vous répond avec attention.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Coordonnées — cartes avec icône accent et lift au survol */}
        <section className="border-b border-line bg-panel" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn>
              <p className="kicker mb-12">Nos coordonnées</p>
            </FadeIn>
            <div className="swiss-grid">
              {coordonnees.map((item, i) => {
                const Icon = item.icon;
                return (
                  <FadeIn key={item.title} delay={i * 0.08} className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="bg-paper border border-line rounded-lg p-6 h-full group"
                    >
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg border border-line mb-5 text-accent group-hover:border-accent transition-colors">
                        <Icon className="w-5 h-5" />
                      </span>
                      <h3 className="text-ink mb-3 group-hover:text-accent transition-colors">{item.title}</h3>
                      <p className="mono text-sm text-soft">{item.text}</p>
                      <p className="mono text-sm text-soft mt-1">{item.sub}</p>
                    </motion.div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Formulaire + carte */}
        <section style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid">
              {/* Formulaire */}
              <FadeIn direction="right" className="col-span-12 md:col-span-7">
                <p className="kicker mb-4">Écrivez-nous</p>
                <h2 className="text-ink mb-12">Envoyez-nous un message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="kicker text-soft">Nom complet</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="kicker text-soft">Adresse Email</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="kicker text-soft">Sujet</label>
                    <input
                      type="text" name="subject" value={formData.subject} onChange={handleChange} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="kicker text-soft">Message</label>
                    <textarea
                      name="message" value={formData.message} onChange={handleChange} required rows={6}
                      className="resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-accent inline-flex items-center gap-2">
                    Envoyer le message <Send className="w-4 h-4" />
                  </button>
                </form>
              </FadeIn>

              {/* Image campus + carte + horaires */}
              <FadeIn direction="left" className="col-span-12 md:col-span-5 mt-12 md:mt-0">
                <p className="kicker mb-4">Notre campus</p>
                <div className="relative overflow-hidden rounded-lg border border-line group mb-8">
                  <img
                    src="/images/school_facade_wide.jpg"
                    alt="Le campus du Collège Le Flambeau"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ height: 'calc(var(--lh) * 11)' }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.7), rgba(17,19,21,0) 60%)' }} />
                  <div
                    className="absolute bottom-4 left-4 px-4 py-2 rounded-lg border border-line"
                    style={{ background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(4px)' }}
                  >
                    <p className="mono text-xs uppercase tracking-widest text-ink">Delmas 31 · Port-au-Prince</p>
                  </div>
                </div>

                <p className="kicker mb-4">Nous trouver</p>
                <div className="aspect-square overflow-hidden border border-line rounded-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.3364214534!2d-72.3152383238634!3d18.529746782565664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb9e7beec3c627d%3A0x8f3bd8024fd3b72b!2sCollege%20Le%20Flambeau!5e0!3m2!1sfr!2sht!4v1714121896000!5m2!1sfr!2sht"
                    className="w-full h-full border-0"
                    loading="lazy"
                  ></iframe>
                </div>

                <div className="border border-line rounded-lg p-6 mt-8">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg border border-line mb-5 text-accent">
                    <Clock className="w-5 h-5" />
                  </span>
                  <h3 className="text-ink mb-3">Heures d'ouverture</h3>
                  <p className="mono text-sm text-soft">Lundi au Vendredi : 8h00 – 16h00</p>
                  <p className="mono text-sm text-soft mt-1">Samedi et Dimanche : Fermé</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
