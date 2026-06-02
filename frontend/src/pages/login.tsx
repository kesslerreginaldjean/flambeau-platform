import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
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

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
      <Head>
        <title>Portail Sécurisé | Le Flambeau</title>
      </Head>

      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#D32D3F]/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#FDE68A]/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl p-4 md:p-8 flex items-center justify-center">
        <div className="w-full flex flex-col md:flex-row bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Left Panel - Brand Immersion */}
          <div className="hidden md:flex w-5/12 bg-[#D32D3F] p-16 flex-col justify-between relative overflow-hidden">
             {/* Decorative patterns */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#D32D3F] to-[#8B1A26]"></div>
             <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-64 h-64 border-[40px] border-white rounded-full"></div>
                <div className="absolute bottom-20 left-10 w-32 h-32 border-[20px] border-white/50 rounded-full"></div>
             </div>

             <div className="relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-12 font-bold uppercase tracking-widest text-[10px] group">
                   <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour au site
                </Link>
                <FadeIn delay={0.2}>
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-3 mb-10 shadow-2xl">
                    <img src="/logo.PNG" alt="CLF" className="w-full h-full object-contain" />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                    L'excellence <br />
                    commence ici.
                  </h1>
                  <div className="w-16 h-1.5 bg-[#FDE68A] rounded-full mb-10"></div>
                  <p className="text-[#FFF8E7] text-lg font-medium opacity-80 leading-relaxed">
                    Connectez-vous pour accéder à vos cours, vos notes et la vie de votre école.
                  </p>
                </FadeIn>
             </div>

             <div className="relative z-10 mt-auto">
                <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                   <div className="w-12 h-12 bg-[#FDE68A] rounded-2xl flex items-center justify-center text-[#D32D3F] shadow-lg">
                      <ShieldCheck className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-white font-bold text-sm">Accès Sécurisé</p>
                      <p className="text-white/60 text-xs font-medium tracking-tight">Système de gestion académique chiffré</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Panel - Premium Login Form */}
          <div className="w-full md:w-7/12 p-8 md:p-20 bg-white relative">
             {/* Mobile Back Button */}
             <div className="md:hidden mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#D32D3F] transition-colors font-bold uppercase tracking-widest text-[10px] group">
                   <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour au site
                </Link>
             </div>

             <div className="max-w-md mx-auto">
                <FadeIn className="text-center md:text-left mb-10 md:mb-12">
                   <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Connexion</h2>
                   <p className="text-slate-500 font-medium">Entrez vos accès pour ouvrir votre session.</p>
                </FadeIn>

                <form onSubmit={handleLogin} className="space-y-8">
                  <FadeIn delay={0.1} className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Type de Profil</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D32D3F] transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <select 
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-full pl-16 pr-10 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-[#D32D3F] outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                      >
                        <option value="student">Élève</option>
                        <option value="parent">Parent</option>
                        <option value="teacher">Professeur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                        <ArrowRight className="w-5 h-5 rotate-90" />
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.2} className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D32D3F] transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        placeholder="nom@exemple.com"
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-[#D32D3F] outline-none transition-all font-bold text-slate-900" 
                      />
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.3} className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mot de passe</label>
                      <button type="button" className="text-[10px] font-bold text-[#D32D3F] uppercase tracking-widest hover:underline">Oublié ?</button>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D32D3F] transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        placeholder="••••••••"
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-[#D32D3F] outline-none transition-all font-bold text-slate-900" 
                      />
                    </div>
                  </FadeIn>

                  {error && (
                    <FadeIn direction="down" className="bg-red-50 text-[#D32D3F] p-5 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#D32D3F] rounded-full animate-pulse"></div>
                      {error}
                    </FadeIn>
                  )}

                  <FadeIn delay={0.4}>
                    <button 
                      type="submit" disabled={loading}
                      className="group w-full py-6 bg-[#D32D3F] text-white font-extrabold rounded-[2rem] hover:bg-[#8B1A26] transition-all shadow-2xl shadow-[#D32D3F]/30 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Entrer dans le Portail
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </FadeIn>
                </form>

                <FadeIn delay={0.5} className="mt-12 pt-8 border-t border-slate-100 text-center">
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Accès restreint</p>
                   <p className="text-slate-500 text-sm font-medium">Si vous n'avez pas vos accès, veuillez contacter le secrétariat du collège.</p>
                </FadeIn>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
