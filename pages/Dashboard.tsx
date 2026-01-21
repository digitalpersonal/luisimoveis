
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Home, 
  DollarSign, 
  ArrowUpRight, 
  Clock,
  CheckCircle2,
  Sparkles,
  QrCode,
  ChevronRight,
  Filter,
  MoreVertical,
  MapPin,
  Phone,
  AlertCircle,
  Key,
  Wrench,
  Calendar,
  MessageSquare,
  Zap,
  ArrowDownCircle,
  ShieldCheck
} from 'lucide-react';
import { analyzeFinancialHealth } from '../services/geminiService';
import { paymentEvents } from '../services/paymentService';
import { PaymentNotification } from '../types';

const KanbanColumn = ({ title, icon: Icon, color, children, count }: any) => (
  <div className="flex flex-col min-w-[320px] max-w-[320px] h-full bg-slate-100/40 rounded-[2.5rem] border border-slate-200/60 p-4">
    <div className="flex items-center justify-between mb-4 px-2">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-xl ${color} text-white shadow-sm`}>
          <Icon size={18} />
        </div>
        <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
        {count}
      </span>
    </div>
    <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
      {children}
    </div>
  </div>
);

const DashboardCard = ({ type, title, subtitle, value, status, time, onClick, isPix }: any) => {
  const getStatusColor = () => {
    if (isPix) return 'border-l-indigo-500 bg-indigo-50/20 shadow-indigo-100/50';
    switch(status) {
      case 'URGENT': return 'border-l-rose-500 bg-rose-50/30';
      case 'PENDING': return 'border-l-amber-500 bg-amber-50/30';
      case 'ACTIVE': return 'border-l-emerald-500 bg-emerald-50/30';
      default: return 'border-l-indigo-600 bg-white';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2 border-l-4 ${getStatusColor()}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-black uppercase tracking-widest ${isPix ? 'text-indigo-600' : 'text-slate-400'}`}>
            {isPix && <Zap size={10} className="inline mr-1 mb-0.5" />}
            {type}
          </span>
        </div>
        <span className="text-[9px] text-slate-400 font-bold">{time}</span>
      </div>
      <h4 className="font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">{title}</h4>
      <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mb-4">{subtitle}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"><Phone size={14}/></button>
          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><MessageSquare size={14}/></button>
        </div>
        <span className={`text-xs font-black ${isPix ? 'text-indigo-600' : 'text-slate-900'}`}>{value}</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [newPixGlow, setNewPixGlow] = useState(false);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('payment_history') || '[]');
    setNotifications(history);

    const handleNewPayment = (e: any) => {
      setNotifications(prev => [e.detail, ...prev].slice(0, 8));
      setNewPixGlow(true);
      setTimeout(() => setNewPixGlow(false), 3000);
    };

    paymentEvents.addEventListener('payment_confirmed', handleNewPayment);
    return () => paymentEvents.removeEventListener('payment_confirmed', handleNewPayment);
  }, []);

  const getAiInsight = async () => {
    setLoadingInsight(true);
    const insight = await analyzeFinancialHealth([]);
    setAiInsight(insight || "Sistema operando com 62% de automação de recebíveis. Taxa de ocupação em Guaranésia subiu 4% este mês.");
    setLoadingInsight(false);
  };

  useEffect(() => {
    getAiInsight();
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      {/* Top Header & Mini Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Controle</h1>
          <p className="text-slate-500 font-medium">Monitoramento em tempo real da Luís Imóveis.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ArrowDownCircle size={18}/></div>
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Receitas (Mês)</p>
                 <p className="text-sm font-black text-slate-900">R$ 1.2M</p>
               </div>
             </div>
             <div className="w-px h-8 bg-slate-100"></div>
             <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Zap size={18}/></div>
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Automação Pix</p>
                 <p className="text-sm font-black text-indigo-600">62%</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* NOVO: Monitor de Recebimentos Pix em Destaque */}
      <div className={`bg-white p-5 rounded-[2.5rem] border-2 transition-all duration-700 ${newPixGlow ? 'border-indigo-500 shadow-2xl shadow-indigo-200' : 'border-slate-100 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <Zap className="text-indigo-600" size={18} />
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Monitor de Liquidações Pix (Tempo Real)</h3>
          </div>
          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter animate-pulse">
            Conectado ao Gateway
          </span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {notifications.length > 0 ? (
            notifications.map((notif, i) => (
              <div 
                key={notif.id}
                className={`min-w-[240px] p-4 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-right-4 duration-500 ${i === 0 && newPixGlow ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-100 hover:bg-white transition-colors'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${i === 0 && newPixGlow ? 'bg-white/20' : 'bg-white text-indigo-600'}`}>
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-black truncate ${i === 0 && newPixGlow ? 'text-white' : 'text-slate-900'}`}>{notif.clientName}</p>
                  <p className={`text-[9px] font-bold ${i === 0 && newPixGlow ? 'text-indigo-100' : 'text-slate-400'}`}>R$ {notif.amount.toFixed(2)} • {notif.propertyCode}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 py-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Aguardando novas confirmações de pagamento...
            </div>
          )}
        </div>
      </div>

      {/* AI Insight Bar */}
      <div className="bg-indigo-900 p-4 md:p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group shrink-0">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
          <Sparkles size={80} />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
            <Sparkles className="text-indigo-200" size={20} />
          </div>
          <p className="text-xs md:text-sm font-medium opacity-90 leading-tight">
            <b>Insight IA:</b> {loadingInsight ? "Analisando liquidações..." : aiInsight}
          </p>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        
        {/* Coluna 1: Leads / CRM */}
        <KanbanColumn title="Novos Leads (CRM)" icon={Users} color="bg-indigo-600" count={4}>
          <DashboardCard 
            type="Portal ZAP" 
            title="Ana Paula Moraes" 
            subtitle="Interesse: Apartamento Moema" 
            value="R$ 1.2M" 
            time="Há 2h"
            onClick={() => navigate('/leads')}
          />
          <DashboardCard 
            type="Instagram Ads" 
            title="Bruno Silveira" 
            subtitle="Interesse: Casa Condomínio" 
            value="R$ 3.5M" 
            time="Há 5h"
            onClick={() => navigate('/leads')}
          />
        </KanbanColumn>

        {/* Coluna 2: Operacional (Vistorias/Chaves) */}
        <KanbanColumn title="Operacional do Dia" icon={Calendar} color="bg-amber-500" count={3}>
          <DashboardCard 
            type="Vistoria" 
            title="Apartamento Moema" 
            subtitle="Vistoriador: André Luiz" 
            value="15:30h" 
            status="PENDING"
            time="Hoje"
            onClick={() => navigate('/inspections')}
          />
          <DashboardCard 
            type="Entrega de Chaves" 
            title="Studio Itaim" 
            subtitle="Locatário: Carlos Silva" 
            value="Confirmado" 
            status="ACTIVE"
            time="Hoje, 11h"
            onClick={() => navigate('/rentals')}
          />
        </KanbanColumn>

        {/* Coluna 3: Financeiro Ativo (Foco em Recebimentos) */}
        <KanbanColumn title="Financeiro & Baixas" icon={DollarSign} color="bg-emerald-600" count={notifications.length + 1}>
          {notifications.slice(0, 3).map((notif) => (
            <DashboardCard 
              key={notif.id}
              isPix={true}
              type="Liquidado via Pix" 
              title={notif.clientName} 
              subtitle={`Conciliação automática: ${notif.propertyCode}`} 
              value={`R$ ${notif.amount.toFixed(2)}`} 
              status="ACTIVE"
              time={notif.timestamp}
              onClick={() => navigate('/financial')}
            />
          ))}
          <DashboardCard 
            type="Boleto Atrasado" 
            title="Marina Santos" 
            subtitle="Aluguel AP-001 (Venc. 10/10)" 
            value="R$ 4.500,00" 
            status="URGENT"
            time="Atrasado"
            onClick={() => navigate('/financial')}
          />
        </KanbanColumn>

        {/* Coluna 4: Manutenção */}
        <KanbanColumn title="Manutenção / Reparos" icon={Wrench} color="bg-rose-500" count={2}>
          <DashboardCard 
            type="Hidráulica" 
            title="Vazamento Cozinha" 
            subtitle="Apartamento Moema - Urgente" 
            value="Orçamento" 
            status="URGENT"
            time="Há 45 min"
            onClick={() => navigate('/maintenance')}
          />
        </KanbanColumn>

      </div>

      {/* Footer / Quick Actions */}
      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl no-print shrink-0">
        <div className="flex items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> Auditoria Luís Imóveis Ativa
          </p>
          <div className="h-4 w-px bg-slate-100"></div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
            Próximo Backup: 23:59h
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => navigate('/reports')} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Relatórios de Caixa</button>
           <button onClick={() => navigate('/calendar')} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Agenda de Visitas</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
