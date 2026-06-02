import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserRole, isAuthenticated } from '@/lib/auth';

/**
 * Audit fix (P1-4): use the canonical role key from lib/auth.ts.
 * Previously this file read `user_role` while login.tsx wrote `user_type`,
 * so the redirect always ended in /login.
 */
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const role = getUserRole();

    switch (role) {
      case 'admin':
        router.push('/dashboard/admin');
        break;
      case 'teacher':
        router.push('/dashboard/teacher');
        break;
      case 'student':
        router.push('/dashboard/student');
        break;
      case 'parent':
        router.push('/dashboard/parent');
        break;
      default:
        router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#D32D3F] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Chargement de votre espace personnel...</p>
      </div>
    </div>
  );
}
