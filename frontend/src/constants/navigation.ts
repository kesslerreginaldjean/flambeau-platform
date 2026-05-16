import { 
  LayoutDashboard, Users, GraduationCap, 
  BadgeDollarSign, Bell, Calendar, MessageSquare, FileText,
  PenTool, History as HistoryIcon, Fingerprint,
  Settings
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
  { name: 'Candidatures', icon: FileText, href: '/dashboard/admin/admissions' },
  { name: 'Étudiants', icon: GraduationCap, href: '/dashboard/admin/students' },
  { name: 'Professeurs', icon: Users, href: '/dashboard/admin/teachers' },
  { name: 'Gestion Académique', icon: HistoryIcon, href: '/dashboard/admin/academic' },
  { name: 'Finance', icon: BadgeDollarSign, href: '/dashboard/admin/finance' },
  { name: 'Calendrier', icon: Calendar, href: '/dashboard/admin/calendar' },
  { name: 'Annonces', icon: Bell, href: '/dashboard/admin/announcements' },
  { name: 'Messages', icon: MessageSquare, href: '/dashboard/admin/messages' },
  { name: 'Utilisateurs', icon: Users, href: '/dashboard/admin/users' },
  { name: 'Paramètres École', icon: Settings, href: '/dashboard/admin/settings' },
];

export const TEACHER_NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/teacher' },
  { name: 'Présences', icon: Fingerprint, href: '/dashboard/teacher/attendance' },
  { name: 'Saisir Notes', icon: PenTool, href: '/dashboard/teacher/grades' },
  { name: 'Emploi du temps', icon: Calendar, href: '/dashboard/admin/calendar' },
  { name: 'Annonces', icon: Bell, href: '/dashboard/announcements' },
];

export const STUDENT_NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/student' },
  { name: 'Mon Dossier', icon: HistoryIcon, href: '/dashboard/student/file' },
  { name: 'Mes Notes', icon: GraduationCap, href: '/dashboard/student/grades' },
  { name: 'Emploi du temps', icon: Calendar, href: '/dashboard/admin/calendar' },
  { name: 'Paiements', icon: BadgeDollarSign, href: '/dashboard/student/payments' },
];

export const PARENT_NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/parent' },
  { name: 'Dossier Enfant', icon: HistoryIcon, href: '/dashboard/parent/file' },
  { name: 'Calendrier', icon: Calendar, href: '/dashboard/admin/calendar' },
  { name: 'Annonces', icon: Bell, href: '/dashboard/announcements' },
];
