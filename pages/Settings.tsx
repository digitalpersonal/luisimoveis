
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  History, 
  Building, 
  Bell, 
  Lock,
  Plus,
  MoreVertical,
  Check,
  DollarSign,
  TrendingDown,
  AlertCircle,
  Clock,
  Save,
  Loader2,
  CreditCard,
  Eye,
  EyeOff,
  ExternalLink,
  HelpCircle,
  Key as KeyIcon,
  Globe,
  Copy,
  Webhook,
  Server,
  Zap,
  CalendarCheck,
  Info
} from 'lucide-react';
import { UserRole, FinancialSettings, MercadoPagoSettings } from '../types';
import { 
  getFinancialSettings, 
  saveFinancialSettings, 
  getMercadoPagoSettings, 
  saveMercadoPagoSettings 
} from '../services/paymentService';

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.FINANCE]: 'Gestor Financeiro',
  [UserRole.BROKER]: 'Corretor',
  [UserRole.CLERK]: 'Atendente',
  [UserRole.ACCOUNTANT]: 'Contador',
};

const MOCK_USERS = [
  { id: '1', name: 'André Silva', email: 'andre@luisimoveis.com', role: UserRole.ADMIN, status: 'Ativo' },
  { id: '2', name: 'Beatriz Costa', email: 'beatriz.f@luisimoveis.com', role: UserRole.FINANCE, status: 'Ativo' },
  { id: '3', name: 'Carlos Santos', email: 'carlos.corretor@luisimoveis.com', role: UserRole.BROKER, status: 'Férias' },
];

const MOCK_LOGS = [
  { id: '1', user: 'André Silva', action: 'Contrato Gerado', target: 'AP-001', time: 'Há 10 min' },
  { id: '2', user: 'Beatriz Costa', action: 'Repasse Confirmado', target: 'Marina Santos', time: 'Há 45 min' },
  { id: '3', user: 'Admin', action: 'Novo Imóvel Cadastrado', target: 'CA-098', time: 'Hoje, 09:30' },
];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings>(getFinancialSettings());
  const [mpSettings, setMpSettings] = useState<MercadoPagoSettings>(getMercadoPagoSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [webhookCopied, setWebhookCopied] = useState(false);

  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isRate = name.includes('Rate');
    
    setFinancialSettings(prev => ({
      ...prev,
      [name]: isRate ? parseFloat(value) / 100 : parseInt(value)
    }));
  };

  const handleMpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setMpSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveFinancial = () => {
    setIsSaving(true);
    saveFinancialSettings(financialSettings);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleSaveMp = () => {
    setIsSaving(true);
    saveMercadoPagoSettings(mpSettings);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configurações do Sistema</h1>
        <p className="text-slate-500 font-medium">Controle total sobre as regras de negócio e integrações.</p>
      </div>

      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide no-print">
        {[
          { id: 'users', label: 'Usuários', icon: <User size={18}/> },
          { id: 'financial', label: 'Financeiro (Taxas)', icon: <DollarSign size={18}/> },
          { id: 'mercado-pago', label: 'Pix Automático', icon: <CreditCard size={18}/> },
          { id: 'logs', label: 'Auditoria', icon: <History size={18}/> },
          { id: 'company', label: 'Institucional', icon: <Building size={18}/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-slate-800 text-lg">Colaboradores</h3>
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100">
              <Plus size={18} /> Novo Usuário
            </button>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Perfil</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_USERS.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs shadow-inner">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-slate-200 shadow-sm">
                          <Shield size={12} className="text-indigo-500" />
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${
                          user.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all active:scale-90">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-12">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[2rem] shadow-inner">
                <DollarSign size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Parâmetros Financeiros</h3>
                <p className="text-sm text-slate-500 font-medium">Defina as regras de cálculo automáticas para aluguéis e taxas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <TrendingDown size={14} className="text-emerald-500" />
                  Desconto de Pontualidade (%)
                </label>
                <div className="relative group">
                  <input 
                    type="number" 
                    name="discountRate"
                    value={Math.round(financialSettings.discountRate * 100)}
                    onChange={handleFinancialChange}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all group-hover:border-indigo-300"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">%</span>
                </div>
                <p className="text-[10px] text-slate-400 italic px-1">Benefício aplicado se pago antes do vencimento.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <AlertCircle size={14} className="text-rose-500" />
                  Multa por Atraso (%)
                </label>
                <div className="relative group">
                  <input 
                    type="number" 
                    name="fineRate"
                    value={Math.round(financialSettings.fineRate * 100)}
                    onChange={handleFinancialChange}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all group-hover:border-indigo-300"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">%</span>
                </div>
                <p className="text-[10px] text-slate-400 italic px-1">Percentual fixo aplicado no 1º dia após vencimento (ou carência).</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Clock size={14} className="text-amber-500" />
                  Juros de Mora Mensais (%)
                </label>
                <div className="relative group">
                  <input 
                    type="number" 
                    name="monthlyInterestRate"
                    value={Math.round(financialSettings.monthlyInterestRate * 100)}
                    onChange={handleFinancialChange}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all group-hover:border-indigo-300"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">%</span>
                </div>
                <p className="text-[10px] text-slate-400 italic px-1">Taxa calculada pro-rata die com base no mês.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <CalendarCheck size={14} className="text-indigo-500" />
                  Período de Carência (Dias)
                </label>
                <div className="relative group">
                  <input 
                    type="number" 
                    name="gracePeriod"
                    value={financialSettings.gracePeriod}
                    onChange={handleFinancialChange}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all group-hover:border-indigo-300"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm">DIAS</span>
                </div>
                <p className="text-[10px] text-slate-400 italic px-1">Tolerância antes da aplicação de multas e juros.</p>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                {saveSuccess ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                    <Check size={20} /> Regras Financeiras Atualizadas!
                  </div>
                ) : (
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-xs text-center md:text-left">
                     As alterações impactam imediatamente o cálculo de novos boletos e o Portal do Cliente.
                   </p>
                )}
              </div>
              <button 
                onClick={handleSaveFinancial}
                disabled={isSaving}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-widest"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Salvar Regras da Imobiliária
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mercado-pago' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Integração Mercado Pago</h3>
                  <p className="text-sm text-slate-500 font-medium">Credenciais de API para automação Pix.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <p className="text-sm font-black text-slate-900">Modo de Produção</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Cobranças Reais Ativadas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isSandbox"
                      checked={!mpSettings.isSandbox}
                      onChange={(e) => setMpSettings(prev => ({ ...prev, isSandbox: !e.target.checked }))}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <KeyIcon size={14} className="text-sky-500"/> Public Key
                  </label>
                  <input 
                    type="text" 
                    name="publicKey"
                    value={mpSettings.publicKey}
                    onChange={handleMpChange}
                    placeholder="APP_USR-..." 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <Lock size={14} className="text-sky-500"/> Access Token
                  </label>
                  <div className="relative">
                    <input 
                      type={showToken ? "text" : "password"} 
                      name="accessToken"
                      value={mpSettings.accessToken}
                      onChange={handleMpChange}
                      placeholder="APP_USR-..." 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none transition-all pr-12" 
                    />
                    <button 
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showToken ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button 
                  onClick={handleSaveMp}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-sky-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-sky-100 active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-widest"
                >
                  {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  Salvar Credenciais Mercado Pago
                </button>
              </div>
            </div>

            {/* Nova Seção: Webhook Notification */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                  <Webhook size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Endpoint de Webhook</h3>
                  <p className="text-sm text-slate-500 font-medium">Configuração para Baixa Automática em tempo real.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Copie a URL abaixo e cole no campo <b>"URL de Notificação"</b> dentro do painel do Mercado Pago para que o sistema Luís Imóveis receba os avisos de pagamento automaticamente.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-[10px] break-all border border-slate-800 shadow-inner">
                    {mpSettings.webhookBaseUrl}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(mpSettings.webhookBaseUrl)}
                    className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                    title="Copiar URL"
                  >
                    {webhookCopied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                  </button>
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                   <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                     <Zap size={12}/> Eventos a Subscrever:
                   </h4>
                   <ul className="text-[10px] font-bold text-amber-700 space-y-1 ml-4 list-disc">
                     <li>payment</li>
                     <li>mp_payment (se disponível)</li>
                     <li>application_not_found</li>
                   </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><HelpCircle size={20}/></div>
                <h3 className="font-black text-slate-900 tracking-tight text-lg">Guia de Configuração Pix</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Para que o Pix funcione corretamente, você deve configurar o Mercado Pago seguindo estes passos:
              </p>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Acesse o Painel de Desenvolvedor (Mercado Pago Developers).', sub: 'Crie uma "Nova Aplicação" ou use uma existente.' },
                  { step: '2', text: 'Obtenha suas Credenciais de Produção.', sub: 'Public Key e Access Token são obrigatórios para transações reais.' },
                  { step: '3', text: 'Configurar Notificações IPN / Webhook.', sub: 'Vá em Notificações > Webhooks, cole a URL de Webhook exibida aqui e marque o evento "payment".' },
                  { step: '4', text: 'Ative o modo de Produção.', sub: 'Lembre-se de ativar a chave acima "Modo de Produção" para começar a receber.' }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 items-start p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-all">
                    <span className="shrink-0 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">{s.step}</span>
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-tight mb-1">{s.text}</p>
                      <p className="text-[10px] font-medium text-slate-400">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Info size={18}/></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Informação Importante</h4>
                </div>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  O sistema utiliza o gateway do Mercado Pago para gerar QRCodes dinâmicos para cada inquilino. Quando o pagamento é feito, o Mercado Pago avisa nossa URL de Webhook, e o sistema dá a baixa automaticamente no contrato e no financeiro.
                </p>
                <button className="mt-6 w-full py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all">
                  Documentação da API
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black text-slate-800 tracking-tight">Histórico de Auditoria</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_LOGS.map(log => (
              <div key={log.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400 shadow-inner">
                    <History size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">
                      <span className="font-black text-slate-900">{log.user}</span> • 
                      <span className="text-indigo-600 font-black"> {log.action} </span> 
                      em <span className="font-black">{log.target}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{log.time}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95 shadow-sm">Detalhes</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
