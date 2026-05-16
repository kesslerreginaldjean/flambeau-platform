'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          
          {/* Institution Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
                <img src="/logo.PNG" alt="CLF" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-[#D32D3F]">CLF</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              "Mieux Choisir Pour Réussir". Une institution d'excellence dédiée à la formation intégrale de la jeunesse haïtienne depuis sa fondation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-400 hover:text-[#D32D3F] transition-colors font-medium text-sm">Accueil</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-[#D32D3F] transition-colors font-medium text-sm">À Propos</Link></li>
              <li><Link href="/programs" className="text-slate-400 hover:text-[#D32D3F] transition-colors font-medium text-sm">Programmes</Link></li>
              <li><Link href="/admissions" className="text-slate-400 hover:text-[#D32D3F] transition-colors font-medium text-sm">Admissions</Link></li>
            </ul>
          </div>

          {/* Practical Info */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Vie Scolaire</h4>
            <ul className="space-y-4">
              <li><Link href="/activities" className="text-slate-400 hover:text-[#D32D3F] transition-colors font-medium text-sm">Activités & Clubs</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-[#D32D3F] transition-colors font-medium text-sm">Contact</Link></li>
              <li><Link href="/login" className="text-[#D32D3F] font-bold text-sm hover:underline">Accès Portail Admin</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Nous trouver</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-slate-500 mt-1 flex-shrink-0" />
                <p className="text-sm font-medium">#11, Delmas 31, <br /> Rue Alexandre Dumas, Port-au-Prince</p>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <p className="text-sm font-medium">+509 2813 1415</p>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <p className="text-sm font-medium">informations@collegeflambeau.edu</p>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Collège Le Flambeau • Une École • Une Vision
          </p>
          <div className="flex gap-8">
             <a href="#" className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Mentions Légales</a>
             <a href="#" className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
