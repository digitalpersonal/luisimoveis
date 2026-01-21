
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Bell, LogOut, Building2, Phone, Search as SearchIcon, 
  CheckCircle2, Clock, Printer, Calendar 
} from 'lucide-react';
import { MENU_ITEMS } from './constants';
import { paymentEvents } from './services/paymentService';
import { PaymentNotification } from './types';

// Pages
import Dashboard from './pages/Dashboard';
import PropertyList from './pages/PropertyList';
import ClientList from './pages/ClientList';
import Financial from './pages/Financial';
import Portal from './pages/Portal';
import ContractManagement from './pages/ContractManagement';
import Rentals from './pages/Rentals';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Chat from './pages/Chat';
import SettingsPage from './pages/Settings';
import DocumentCenter from './pages/DocumentCenter';
import Leads from './pages/Leads';
import Maintenance from './pages/Maintenance';
import Inspections from './pages/Inspections';
import CalendarPage from './pages/Calendar';
import ClientPortal from './pages/ClientPortal';

const PrintHeader = () => (
  <div className="print-only-header flex flex-col">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <Building2 className="text-indigo-900" size={40} />
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Luís Imóveis</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Guaranésia - MG | (35) 99999-0000 | CNPJ: 00.000.000/0001-00</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Documento Oficial</p>
        <div className="flex items-center justify-end gap-2 text-sm font-black text-slate-900">
          <Calendar size={14} />
          {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  </div>
);

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 sidebar no-print`}>
      <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Building2 className="text-indigo-400" />
          <span className="text-xl font-bold tracking-tight">Luís <span className="text-indigo-400">Imóveis</span></span>
        </Link>
        <button onClick={toggle} className="lg:hidden p-2 text-slate-400 hover:text-white"><X size={24} /></button>
      </div>
      <nav className="mt-6 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
              location.pathname === item.path ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon} <span className="text-xs font-medium tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('payment_history') || '[]');
    setNotifications(history.slice(0, 5));
    const handleNewPayment = (e: any) => setNotifications(prev => [e.detail, ...prev].slice(0, 5));
    paymentEvents.addEventListener('payment_confirmed', handleNewPayment);
    return () => paymentEvents.removeEventListener('payment_confirmed', handleNewPayment);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm no-print">
      <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600"><Menu size={24} /></button>
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Buscar em Guaranésia..." />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => window.print()} className="p-2 text-slate-600 hover:bg-slate-50 rounded-full" title="Imprimir"><Printer size={20} /></button>
        <div className="relative group">
          <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full">
            <Bell size={20} />
            {notifications.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>}
          </button>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <Link to="/chat" className="flex items-center gap-2 text-emerald-600 p-2 rounded-xl font-bold text-sm">
          <Phone size={18} /> WhatsApp
        </Link>
      </div>
    </header>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isPublicPage = location.pathname === '/';

  if (isPublicPage) return <Portal />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <PrintHeader />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/contracts" element={<ContractManagement />} />
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/documents" element={<DocumentCenter />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/client-portal" element={<ClientPortal />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<Portal />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default () => <HashRouter><MainLayout /></HashRouter>;
