
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
  Zap
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
    setFinancialSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) / 100
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações do Sistema</h1>
        <p className="text-slate-500">Gerencie usuários, permissões e parâmetros da imobiliária.</p>
      </div>

      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { id: 'users', label: 'Usuários e Permissões', icon: <User size={18}/> },
          { id: 'financial', label: 'Taxas e Descontos', icon: <DollarSign size={18}/> },
          { id: 'mercado-pago', label: 'Mercado Pago (Pix)', icon: <CreditCard size={18}/> },
          { id: 'logs', label: 'Logs de Auditoria', icon: <History size={18}/> },
          { id: 'company', label: 'Dados Institucionais', icon: <Building size={18}/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Colaboradores</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
              <Plus size={18} /> Convidar Usuário
            </button>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nome</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Perfil</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_USERS.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          <Shield size={12} className="text-indigo-500" />
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                          user.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all">
                          <MoreVertical size={16} />
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
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <DollarSign size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Configurações de Regras Financeiras</h3>
                <p className="text-sm text-slate-500 font-medium">Defina como o sistema calcula multas e benefícios automaticamente.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <TrendingDown size={14} className="text-emerald-500" />
                  Desconto de Pontualidade (%)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="discountRate"
                    value={Math.round(financialSettings.discountRate * 100)}
                    onChange={handleFinancialChange}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <AlertCircle size={14} className="text-rose-500" />
                  Multa por Atraso (%)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="fineRate"
                    value={Math.round(financialSettings.fineRate * 100)}
                    onChange={handleFinancialChange}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <Clock size={14} className="text-amber-500" />
                  Juros de Mora Mensais (%)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="monthlyInterestRate"
                    value={Math.round(financialSettings.monthlyInterestRate * 100)}
                    onChange={handleFinancialChange}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-left-2">
                    <Check size={18} /> Regras salvas com sucesso!
                  </div>
                )}
              </div>
              <button 
                onClick={handleSaveFinancial}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mercado-pago' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="space-y-6">
            {/* Bloco de Credenciais */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Integração Mercado Pago</h3>
                  <p className="text-sm text-slate-500 font-medium">Credenciais de API para pagamentos via Pix.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Modo de Produção</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Cobranças Reais Ativadas</p>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <KeyIcon size={14}/> Public Key
                  </label>
                  <input 
                    type="text" 
                    name="publicKey"
                    value={mpSettings.publicKey}
                    onChange={handleMpChange}
                    placeholder="APP_USR-..." 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-sky-500 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock size={14}/> Access Token
                  </label>
                  <div className="relative">
                    <input 
                      type={showToken ? "text" : "password"} 
                      name="accessToken"
                      value={mpSettings.accessToken}
                      onChange={handleMpChange}
                      placeholder="APP_USR-..." 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-sky-500 outline-none transition-all pr-12" 
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

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={handleSaveMp}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 transition-all shadow-xl shadow-sky-100 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  Salvar Credenciais
                </button>
              </div>
            </div>

            {/* Bloco de Notificação de Pagamento (Supabase Webhook) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Supabase Webhook (IPN)</h3>
                    <p className="text-xs text-slate-500 font-medium">URL da sua Edge Function para baixa automática.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Server size={14}/> URL da Edge Function (Supabase)
                    </label>
                    <input 
                      type="text" 
                      name="webhookBaseUrl"
                      value={mpSettings.webhookBaseUrl}
                      onChange={handleMpChange}
                      placeholder="https://[PROJETO].supabase.co/functions/v1/mercadopago-webhook" 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    />
                    <p className="text-[9px] text-slate-400 italic">Insira a URL completa que você criou no painel do Supabase.</p>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl flex items-center gap-3 group relative border border-slate-800">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Copiar para o Mercado Pago:</p>
                      <p className="text-xs font-mono text-white truncate">{mpSettings.webhookBaseUrl}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(mpSettings.webhookBaseUrl)}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all shadow-sm shrink-0 active:scale-90"
                      title="Copiar Link"
                    >
                      {webhookCopied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-800 uppercase mb-1 flex items-center gap-1.5">
                      <Zap size={12}/> Por que o link do Supabase?
                    </p>
                    <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                      O Mercado Pago avisa ao seu <b>Backend no Supabase</b> quando um Pix é pago. Essa Edge Function então atualiza o status no seu banco de dados automaticamente. O domínio do site (frontend) não consegue "ouvir" esses avisos.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><HelpCircle size={20}/></div>
                <h3 className="font-bold text-slate-900">Onde colar no Mercado Pago?</h3>
              </div>

              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
                  {/* Ilustração Visual Explicativa */}
                  <div className="aspect-video bg-slate-50 p-4 flex flex-col">
                    <div className="w-full h-8 bg-slate-200 rounded-t-lg flex items-center px-3 gap-2 border-b border-slate-300">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <div className="ml-4 w-32 h-3 bg-slate-300 rounded"></div>
                    </div>
                    <div className="flex-1 flex gap-4 p-4">
                      <div className="w-1/4 space-y-2">
                        <div className="w-full h-3 bg-indigo-100 rounded"></div>
                        <div className="w-full h-3 bg-slate-200 rounded"></div>
                        <div className="w-full h-3 bg-sky-500 rounded ring-2 ring-sky-200"></div>
                        <div className="w-full h-3 bg-indigo-600 rounded"></div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="h-6 w-1/2 bg-slate-200 rounded"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-20 bg-white border-2 border-dashed border-sky-400 rounded-xl flex items-center justify-center flex-col gap-1">
                             <span className="text-[8px] font-black text-sky-600 uppercase">Webhooks</span>
                             <span className="text-[7px] text-slate-400">Colar Link do Supabase</span>
                          </div>
                          <div className="h-20 bg-slate-200 rounded-xl"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                     <span className="bg-white px-4 py-2 rounded-full text-xs font-black text-indigo-600 shadow-xl">Painel de Integração MP</span>
                  </div>
                </div>

                <ol className="space-y-4">
                  {[
                    { step: '1', text: 'No Supabase, vá em Edge Functions e copie a URL pública da sua função.', link: 'https://supabase.com/dashboard/project/_/functions' },
                    { step: '2', text: 'No Mercado Pago Developers, selecione sua aplicação.', link: 'https://www.mercadopago.com.br/developers/panel' },
                    { step: '3', text: 'Clique em "Notificações" > "Webhooks".' },
                    { step: '4', text: 'Cole a URL da sua Edge Function no campo "URL de retorno".' },
                    { step: '5', text: 'Marque "Pagamentos" e "IPN" e salve as alterações.' }
                  ].map((s, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{s.step}</span>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600 leading-tight">{s.text}</p>
                        {s.link && (
                          <a href={s.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black text-sky-600 uppercase hover:underline">
                            Verificar no {s.link.includes('supabase') ? 'Supabase' : 'Mercado Pago'} <ExternalLink size={10}/>
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outras Abas */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Histórico de Atividade</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_LOGS.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                    <History size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">
                      <span className="font-bold text-slate-900">{log.user}</span> realizou 
                      <span className="font-semibold text-indigo-600"> {log.action} </span> 
                      em <span className="font-medium">{log.target}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{log.time}</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:underline">Detalhes</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'company' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in duration-300 max-w-3xl">
          <h3 className="font-bold text-slate-800 mb-6">Informações Institucionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Razão Social</label>
                <input type="text" defaultValue="Luís Imóveis Gestão Imobiliária LTDA" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CNPJ</label>
                <input type="text" defaultValue="12.345.678/0001-90" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CRECI Jurídico</label>
                <input type="text" defaultValue="J-12345" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Endereço Sede</label>
                <input type="text" defaultValue="Centro - Guaranésia, MG" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail Principal</label>
                <input type="email" defaultValue="contato@luisimoveis.com.br" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefone/WhatsApp</label>
                <input type="text" defaultValue="(35) 99999-0000" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
              Salvar Alterações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
