
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut, 
  Building2,
  Phone,
  Search as SearchIcon,
  CheckCircle2,
  Clock,
  Printer,
  Calendar
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
  <div className="print-only-header hidden">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <Building2 className="text-indigo-900" size={40} />
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Luís Imóveis</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Guaranésia - MG | (35) 99999-0000</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Documento Gerado Em</p>
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
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 sidebar`}>
      <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Building2 className="text-indigo-400" />
          <span className="text-xl font-bold tracking-tight">Luís <span className="text-indigo-400">Imóveis</span></span>
        </Link>
        <button onClick={toggle} className="lg:hidden text-slate-400 hover:text-white p-2 active:scale-95 transition-all">
          <X size={24} />
        </button>
      </div>

      <nav className="mt-6 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-hide pb-20">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => { if(window.innerWidth < 1024) toggle(); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group active:scale-[0.98] ${
              location.pathname === item.path 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={`${location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>
              {item.icon}
            </span>
            <span className="font-medium text-xs tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs shadow-inner">AD</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">Luís Admin</p>
            <p className="text-[10px] text-slate-500 truncate">contato@luisimoveis.com.br</p>
          </div>
          <button 
            onClick={() => { if(confirm('Deseja sair do sistema?')) window.location.reload(); }} 
            className="text-slate-500 cursor-pointer hover:text-rose-400 transition-colors active:scale-95"
            title="Sair do Sistema"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('payment_history') || '[]');
    setNotifications(history);

    const handleNewPayment = (e: any) => {
      setNotifications(prev => [e.detail, ...prev].slice(0, 5));
    };

    paymentEvents.addEventListener('payment_confirmed', handleNewPayment);
    return () => paymentEvents.removeEventListener('payment_confirmed', handleNewPayment);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      alert(`Buscando por: ${searchValue}`);
      setSearchValue('');
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('payment_history');
    setShowNotifications(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm header">
      <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg active:scale-95 transition-all">
        <Menu size={24} />
      </button>

      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="Buscar por imóveis, clientes ou contratos..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => window.print()} 
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-all active:scale-95 no-print"
          title="Imprimir Página"
        >
          <Printer size={20} />
        </button>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-all active:scale-95 ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 no-print">
              <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
                <span className="font-bold text-sm">Notificações Recentes</span>
                <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase">Novo</span>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">Pagamento Pix Confirmado</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">Cliente: {notif.clientName}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] font-black text-indigo-600">R$ {notif.amount.toFixed(2)}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10}/> {notif.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="mx-auto text-slate-200 mb-2" size={32} />
                    <p className="text-xs text-slate-400 font-medium">Nenhuma nova notificação</p>
                  </div>
                )}
              </div>
              <button 
                onClick={clearNotifications}
                className="w-full p-3 text-center text-[10px] font-black text-indigo-600 bg-slate-50 hover:bg-slate-100 uppercase tracking-widest transition-colors active:bg-slate-200"
              >
                Limpar Todas Notificações
              </button>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        
        <Link to="/chat" className="flex items-center gap-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 p-2 rounded-xl transition-all group no-print active:scale-95">
          <Phone size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold hidden sm:inline">WhatsApp</span>
        </Link>
      </div>
    </header>
  );
};

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const isPublicPage = location.pathname === '/';

  if (isPublicPage) {
    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <Routes>
            <Route path="/" element={<Portal />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
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
            {/* Rota raiz para garantir que o Portal sempre carregue se cair aqui */}
            <Route path="/" element={<Portal />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <MainLayout />
    </HashRouter>
  );
};

export default App;
