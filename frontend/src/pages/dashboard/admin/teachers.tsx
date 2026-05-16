import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, BookOpen, MoreHorizontal } from 'lucide-react';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/teachers');
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

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Corps Professoral</h1>
          <p className="text-slate-500 font-medium">Visualisez et gérez les enseignants de l'institution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Chargement...</p>
          ) : teachers.map((teacher) => (
            <Card key={teacher.id} className="border-none shadow-lg rounded-[2rem] overflow-hidden bg-white hover:shadow-xl transition-shadow">
              <div className="h-24 bg-gradient-to-r from-[#D32D3F] to-[#8B1A26] relative">
                 <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md">
                       <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-[#D32D3F]">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                       </div>
                    </div>
                 </div>
              </div>
              <CardContent className="pt-14 p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{teacher.firstName} {teacher.lastName}</h3>
                  <p className="text-sm font-medium text-[#D32D3F] flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {teacher.teacher?.subject || 'Matière non définie'}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" /> {teacher.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" /> {teacher.phone || 'Non renseigné'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> {teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <Badge className="bg-green-100 text-green-700 border-none px-3 py-1 rounded-full font-bold">
                    Actif
                  </Badge>
                  <button className="text-slate-400 hover:text-slate-600">
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
