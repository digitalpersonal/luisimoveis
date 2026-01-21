
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Home, DollarSign, CheckCircle2, Sparkles, Phone, MessageSquare, Zap, ArrowDownCircle, ShieldCheck, Printer
} from 'lucide-react';
import { analyzeFinancialHealth } from '../services/geminiService';
import { paymentEvents } from '../services/paymentService';
import { PaymentNotification } from '../types';

const KanbanColumn = ({ title, icon: Icon, color, children, count }: any) => (
  <div className="flex flex-col min-w-[320px] max-w-[320px] h-full bg-slate-100/40 rounded-[2.5rem] border border-slate-200/60 p-4">
    <div className="flex items-center justify-between mb-4 px-2">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-xl ${color} text-white shadow-sm`}><Icon size={18} /></div>
        <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-full">{count}</span>
    </div>
    <div className="space-y-4 overflow-y-auto flex-1 pr-1">{children}</div>
  </div>
);

const DashboardCard = ({ type, title, subtitle, value, status, time, onClick, isPix }: any) => (
  <div 
    onClick={onClick}
    className={`p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group border-l-4 ${
      isPix ? 'border-l-indigo-500 bg-indigo-50/20' : 
      status === 'URGENT' ? 'border-l-rose-500 bg-rose-50/30' : 'border-l-indigo-600 bg-white'
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <span className={`text-[9px] font-black uppercase tracking-widest ${isPix ? 'text-indigo-600' : 'text-slate-400'}`}>
        {isPix && <Zap size={10} className="inline mr-1" />} {type}
      </span>
      <span className="text-[9px] text-slate-400 font-bold">{time}</span>
    </div>
    <h4 className="font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{title}</h4>
    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mb-4">{subtitle}</p>
    <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
      <div className="flex items-center gap-1">
        <button className="p-1.5 text-slate-400 hover:text-emerald-500"><Phone size={14}/></button>
        <button className="p-1.5 text-slate-400 hover:text-indigo-600"><MessageSquare size={14}/></button>
      </div>
      <span className={`text-xs font-black ${isPix ? 'text-indigo-600' : 'text-slate-900'}`}>{value}</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
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
    analyzeFinancialHealth([]).then(setAiInsight);
    return () => paymentEvents.removeEventListener('payment_confirmed', handleNewPayment);
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Controle</h1>
          <p className="text-slate-500 font-medium">Operação Luís Imóveis em Guaranésia - MG.</p>
        </div>
        <button onClick={() => window.print()} className="no-print flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest"><Printer size={18}/> Imprimir Sumário</button>
      </div>

      {/* Monitor Pix em Destaque */}
      <div className={`bg-white p-5 rounded-[2.5rem] border-2 transition-all duration-700 ${newPixGlow ? 'border-indigo-500 shadow-2xl shadow-indigo-200' : 'border-slate-100 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <Zap className="text-indigo-600" size={18} />
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Monitor de Baixas Automáticas (Pix Guaranésia)</h3>
          </div>
          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">Gateway Conectado</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {notifications.length > 0 ? notifications.map((notif, i) => (
            <div key={notif.id} className={`min-w-[240px] p-4 rounded-2xl border flex items-center gap-4 ${i === 0 && newPixGlow ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 && newPixGlow ? 'bg-white/20' : 'bg-white text-indigo-600'}`}><CheckCircle2 size={20} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black truncate">{notif.clientName}</p>
                <p className={`text-[9px] font-bold ${i === 0 && newPixGlow ? 'text-indigo-100' : 'text-slate-400'}`}>R$ {notif.amount.toFixed(2)} • {notif.propertyCode}</p>
              </div>
            </div>
          )) : <div className="flex-1 py-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Aguardando liquidações automáticas...</div>}
        </div>
      </div>

      <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-2.5 bg-white/10 rounded-xl"><Sparkles className="text-indigo-200" size={20} /></div>
          <p className="text-sm font-medium opacity-90 leading-tight"><b>Insight IA:</b> {aiInsight || "Analisando liquidações..."}</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        <KanbanColumn title="Novos Leads (CRM)" icon={Users} color="bg-indigo-600" count={4}>
          <DashboardCard type="Portal ZAP" title="Ana Paula Moraes" subtitle="Interesse: Vila Betel" value="R$ 1.2M" time="Há 2h" onClick={() => navigate('/leads')} />
        </KanbanColumn>
        <KanbanColumn title="Financeiro & Baixas" icon={DollarSign} color="bg-emerald-600" count={notifications.length + 1}>
          {notifications.slice(0, 3).map((notif) => (
            <DashboardCard key={notif.id} isPix={true} type="Liquidado Pix" title={notif.clientName} subtitle={`Conciliado: ${notif.propertyCode}`} value={`R$ ${notif.amount.toFixed(2)}`} time={notif.timestamp} />
          ))}
          <DashboardCard type="Boleto Atrasado" title="Marina Santos" subtitle="Aluguel Centro (Venc. 10/10)" value="R$ 4.500,00" status="URGENT" time="Atrasado" />
        </KanbanColumn>
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl no-print shrink-0">
        <div className="flex items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Auditoria Ativa Guaranésia</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => navigate('/reports')} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500">Relatórios de Caixa</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
