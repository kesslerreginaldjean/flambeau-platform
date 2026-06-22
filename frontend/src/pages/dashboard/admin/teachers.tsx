import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, BookOpen, MoreHorizontal } from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await authFetch('/api/admin/teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Gestion des Professeurs | CLF</title>
      </Head>

      <div>
        <div className="mb-8 border-b border-line pb-6">
          <p className="kicker mb-2">Administration</p>
          <h1 className="text-3xl font-semibold text-ink tracking-tight">Corps Professoral</h1>
          <p className="text-soft mt-1">Visualisez et gérez les enseignants de l'institution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="mono text-xs uppercase tracking-widest text-soft animate-pulse">Chargement...</p>
          ) : teachers.map((teacher) => (
            <Card key={teacher.id} className="bg-paper">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border border-line flex items-center justify-center numeral text-xl text-accent shrink-0">
                    {teacher.firstName[0]}{teacher.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{teacher.firstName} {teacher.lastName}</h3>
                    <p className="text-sm font-medium text-accent flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {teacher.teacher?.subject || 'Matière non définie'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-soft pt-4 border-t border-line">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-soft" /> {teacher.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-soft" /> {teacher.phone || 'Non renseigné'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-soft" /> {teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="pt-4 border-t border-line flex justify-between items-center">
                  <Badge className="mono text-xs uppercase tracking-widest text-accent">
                    Actif
                  </Badge>
                  <button className="text-soft hover:text-ink transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
