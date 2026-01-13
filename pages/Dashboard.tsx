
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Home, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Circle,
  QrCode,
  Bell,
  ChevronRight
} from 'lucide-react';
import { analyzeFinancialHealth } from '../services/geminiService';
import { paymentEvents } from '../services/paymentService';
import { PaymentNotification } from '../types';

const data = [
  { name: 'Jan', income: 45000, expense: 32000 },
  { name: 'Fev', income: 52000, expense: 34000 },
  { name: 'Mar', income: 48000, expense: 31000 },
  { name: 'Abr', income: 61000, expense: 38000 },
  { name: 'Mai', income: 55000, expense: 35000 },
  { name: 'Jun', income: 67000, expense: 42000 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 group cursor-pointer">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <div className={`flex items-center text-xs font-black px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
    <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('payment_history') || '[]');
    setNotifications(history);

    const handleNewPayment = (e: any) => {
      setNotifications(prev => [e.detail, ...prev].slice(0, 5));
    };

    paymentEvents.addEventListener('payment_confirmed', handleNewPayment);
    return () => paymentEvents.removeEventListener('payment_confirmed', handleNewPayment);
  }, []);

  const getAiInsight = async () => {
    setLoadingInsight(true);
    const transactions = [
      { date: '2023-10-01', type: 'INCOME', amount: 50000, description: 'Vendas' },
      { date: '2023-10-02', type: 'EXPENSE', amount: 35000, description: 'Operacional' },
    ];
    const insight = await analyzeFinancialHealth(transactions);
    setAiInsight(insight || "A saúde financeira em Guaranésia está estável. O mercado de locação residencial teve alta de 8%.");
    setLoadingInsight(false);
  };

  useEffect(() => {
    getAiInsight();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Gestão - Guaranésia</h1>
          <p className="text-slate-500 font-medium">Bom dia, Admin. Veja o panorama do mercado regional hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <Home size={18} /> Novo Imóvel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Faturamento Local" value="R$ 1.2M" change="+12.5%" icon={DollarSign} trend="up" />
        <StatCard title="Pagamentos Pix" value={notifications.length} change="Live" icon={QrCode} trend="up" />
        <StatCard title="Unidades Ativas" value="156" change="-2.4%" icon={Home} trend="down" />
        <StatCard title="Inadimplência" value="4.2%" change="-1.1%" icon={Users} trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Sparkles size={160} />
            </div>
            <div className="flex items-start gap-6 relative z-10">
              <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-lg">
                <Sparkles className="text-indigo-200" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-xl mb-2 flex items-center gap-2">Inteligência Estratégica IA</h3>
                <p className="text-indigo-100 text-sm leading-relaxed font-medium opacity-90 max-w-xl">
                  {loadingInsight ? "Analisando dados do mercado local em Guaranésia..." : (aiInsight || "A saúde financeira regional está estável. Destaque para novos loteamentos.")}
                </p>
                <button className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-colors border border-white/10">
                  Ver Relatório Regional
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-800 text-lg">Histórico Mensal</h3>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receitas</span>
                 </div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} 
                  />
                  <Area type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={4} fill="url(#colorIncome)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
              <QrCode size={22} className="text-indigo-600" />
              Liquidações Recentes
            </h3>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">Live</span>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl animate-in slide-in-from-right-4 duration-500 group hover:border-indigo-300 hover:bg-white transition-all shadow-sm hover:shadow-md cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Confirmado
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{notif.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{notif.clientName}</h4>
                  <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-tight">Cód: {notif.propertyCode}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm font-black text-slate-900">R$ {notif.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <QrCode size={28} className="text-slate-200" />
                </div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest leading-relaxed">Aguardando<br/>movimentação...</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/financial')}
            className="w-full mt-6 py-4 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-indigo-600 transition-all uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95"
          >
            Ver Extrato Completo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
