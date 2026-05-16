'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Header */}
        <section className="py-24 bg-[#FFF8E7]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-sm font-bold text-[#D32D3F] uppercase tracking-[0.4em] mb-6">Contactez-nous</h1>
            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-8">
              Nous sommes à <br /> votre écoute
            </h2>
            <div className="w-24 h-2 bg-[#D32D3F] mx-auto rounded-full"></div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
              
              {/* Contact Info Cards */}
              {[
                { icon: Phone, title: 'Téléphone', text: '+509 2813 1415 / 2813 1416', sub: 'Lundi - Vendredi, 8h - 16h' },
                { icon: Mail, title: 'Courriel', text: 'informations@collegeflambeau.edu', sub: 'Réponse sous 24h ouvrées' },
                { icon: MapPin, title: 'Adresse', text: '#11, Delmas 31', sub: 'Rue Alexandre Dumas, Port-au-Prince' }
              ].map((item, i) => (
                <div key={i} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-[#D32D3F]">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-slate-900 font-extrabold text-sm mb-1">{item.text}</p>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {/* Contact Form */}
              <div className="space-y-10">
                 <h3 className="text-3xl font-extrabold text-slate-900">Envoyez-nous un message</h3>
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nom complet</label>
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:bg-white focus:border-[#D32D3F] outline-none transition-all font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adresse Email</label>
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:bg-white focus:border-[#D32D3F] outline-none transition-all font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sujet</label>
                      <input 
                        type="text" name="subject" value={formData.subject} onChange={handleChange} required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:bg-white focus:border-[#D32D3F] outline-none transition-all font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message</label>
                      <textarea 
                        name="message" value={formData.message} onChange={handleChange} required rows={6}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:bg-white focus:border-[#D32D3F] outline-none transition-all font-medium resize-none" 
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="group flex items-center justify-center gap-3 px-10 py-5 bg-[#D32D3F] text-white font-extrabold rounded-2xl hover:bg-[#8B1A26] transition-all shadow-xl shadow-[#D32D3F]/20"
                    >
                      Envoyer le message
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                 </form>
              </div>

              {/* Map/Hours Side */}
              <div className="space-y-12">
                 <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden border border-slate-200 relative grayscale hover:grayscale-0 transition-all duration-700">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.3364214534!2d-72.3152383238634!3d18.529746782565664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb9e7beec3c627d%3A0x8f3bd8024fd3b72b!2sCollege%20Le%20Flambeau!5e0!3m2!1sfr!2sht!4v1714121896000!5m2!1sfr!2sht" 
                      className="w-full h-full border-0" 
                      loading="lazy"
                    ></iframe>
                 </div>
                 
                 <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] flex items-center gap-8">
                    <Clock className="w-12 h-12 text-[#FDE68A] flex-shrink-0" />
                    <div>
                       <h4 className="text-xl font-bold mb-1 text-white">Heures d'ouverture</h4>
                       <p className="text-sm text-slate-400 font-medium">Lundi au Vendredi : 8h00 - 16h00</p>
                       <p className="text-sm text-slate-400 font-medium">Samedi et Dimanche : Fermé</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
