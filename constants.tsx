
import React from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  FileText, 
  DollarSign, 
  PieChart, 
  MessageSquare, 
  Settings,
  Search,
  Key,
  TrendingUp,
  FolderOpen,
  Filter,
  Wrench,
  CalendarDays,
  ClipboardCheck,
  Calendar as CalendarIcon,
  UserCircle
} from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { id: 'leads', label: 'Leads / CRM', icon: <Filter size={20} />, path: '/leads' },
  { id: 'calendar', label: 'Agenda & Visitas', icon: <CalendarIcon size={20} />, path: '/calendar' },
  { id: 'properties', label: 'Imóveis', icon: <Home size={20} />, path: '/properties' },
  { id: 'clients', label: 'Clientes', icon: <Users size={20} />, path: '/clients' },
  { id: 'rentals', label: 'Locações', icon: <Key size={20} />, path: '/rentals' },
  { id: 'sales', label: 'Vendas', icon: <TrendingUp size={20} />, path: '/sales' },
  { id: 'contracts', label: 'Contratos', icon: <FileText size={20} />, path: '/contracts' },
  { id: 'inspections', label: 'Vistorias', icon: <ClipboardCheck size={20} />, path: '/inspections' },
  { id: 'maintenance', label: 'Manutenção', icon: <Wrench size={20} />, path: '/maintenance' },
  { id: 'documents', label: 'Documentos', icon: <FolderOpen size={20} />, path: '/documents' },
  { id: 'financial', label: 'Financeiro', icon: <DollarSign size={20} />, path: '/financial' },
  { id: 'reports', label: 'Relatórios', icon: <PieChart size={20} />, path: '/reports' },
  { id: 'chat', label: 'Comunicação', icon: <MessageSquare size={20} />, path: '/chat' },
  { id: 'client-portal', label: 'Portal do Cliente', icon: <UserCircle size={20} />, path: '/client-portal' },
  { id: 'portal', label: 'Portal Público', icon: <Search size={20} />, path: '/portal' },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} />, path: '/settings' },
];

export const APP_THEME = {
  primary: 'indigo-600',
  secondary: 'slate-600',
  accent: 'emerald-500',
  danger: 'rose-500',
  warning: 'amber-500'
};
