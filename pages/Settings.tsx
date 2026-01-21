
import React, { useState } from 'react';
import { 
  User, Shield, DollarSign, Save, Loader2, CreditCard, Eye, EyeOff, Key as KeyIcon, Copy, Webhook, Zap, Info, Check, HelpCircle
} from 'lucide-react';
import { UserRole, FinancialSettings, MercadoPagoSettings } from '../types';
import { 
  getFinancialSettings, saveFinancialSettings, getMercadoPagoSettings, saveMercadoPagoSettings 
} from '../services/paymentService';

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.FINANCE]: 'Gestor Financeiro',
  [UserRole.BROKER]: 'Corretor',
  [UserRole.CLERK]: 'Atendente',
  [UserRole.ACCOUNTANT]: 'Contador',
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mercado-pago');
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings>(getFinancialSettings());
  const [mpSettings, setMpSettings] = useState<MercadoPagoSettings>(getMercadoPagoSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [webhookCopied, setWebhookCopied] = useState(false);

  const handleSaveMp = () => {
    setIsSaving(true);
    saveMercadoPagoSettings(mpSettings);
    setTimeout(() => { setIsSaving(false); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configurações</h1>
        <p className="text-slate-500 font-medium">Controle de taxas e integrações de Guaranésia.</p>
      </div>

      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto no-print">
        {[{ id: 'users', label: 'Usuários', icon: <User size={18}/> }, { id: 'financial', label: 'Financeiro', icon: <DollarSign size={18}/> }, { id: 'mercado-pago', label: 'Pix Automático', icon: <CreditCard size={18}/> }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`}>
            {tab.icon} {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {activeTab === 'mercado-pago' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl"><CreditCard size={28} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Integração Mercado Pago</h3>
                  <p className="text-sm text-slate-500 font-medium">Credenciais para automação Pix em Guaranésia.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1"><KeyIcon size={14} className="text-sky-500"/> Public Key</label>
                  <input type="text" value={mpSettings.publicKey} onChange={(e) => setMpSettings({...mpSettings, publicKey: e.target.value})} placeholder="APP_USR-..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1"><Lock size={14} className="text-sky-500"/> Access Token</label>
                  <div className="relative">
                    <input type={showToken ? "text" : "password"} value={mpSettings.accessToken} onChange={(e) => setMpSettings({...mpSettings, accessToken: e.target.value})} placeholder="APP_USR-..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono outline-none pr-12" />
                    <button onClick={() => setShowToken(!showToken)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showToken ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                  </div>
                </div>
                <button onClick={handleSaveMp} disabled={isSaving} className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-sky-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-sky-100 active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-widest">
                  {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} Salvar Credenciais
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Webhook size={28} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">URL de Webhook (Notificações)</h3>
                  <p className="text-sm text-slate-500 font-medium">Para Baixa Automática em tempo real.</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">Copie a URL abaixo e cole no campo <b>"URL de Notificação"</b> no painel do Mercado Pago:</p>
                <div className="flex gap-2">
                  <div className="flex-1 p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-[10px] break-all border border-slate-800 shadow-inner">{mpSettings.webhookBaseUrl}</div>
                  <button onClick={() => copyToClipboard(mpSettings.webhookBaseUrl)} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 active:scale-95 transition-all">
                    {webhookCopied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                  </button>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                   <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Zap size={12}/> Eventos Necessários:</h4>
                   <ul className="text-[10px] font-bold text-amber-700 space-y-1 ml-4 list-disc"><li>payment</li><li>mp_payment</li></ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 h-fit">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><HelpCircle size={20}/></div>
              <h3 className="font-black text-slate-900 tracking-tight text-lg">Passo a Passo (Configuração)</h3>
            </div>
            <div className="space-y-4">
              {[
                { step: '1', text: 'Acesse o Painel Developers do Mercado Pago.', sub: 'Crie uma aplicação "Pagamentos Online".' },
                { step: '2', text: 'Obtenha suas Credenciais de Produção.', sub: 'Insira o Public Key e Access Token no formulário ao lado.' },
                { step: '3', text: 'Configure o Webhook.', sub: 'Vá em Notificações > Webhooks, cole a URL de Webhook e marque "payment".' },
                { step: '4', text: 'Valide o Recebimento.', sub: 'O sistema Luís Imóveis passará a dar baixa automática via Pix.' }
              ].map((s, i) => (
                <div key={i} className="flex gap-4 items-start p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-all">
                  <span className="shrink-0 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-lg group-hover:scale-110 transition-transform">{s.step}</span>
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
                <h4 className="text-[10px] font-black uppercase tracking-widest">Atenção Financeiro</h4>
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">O sistema não faz a baixa automática se o Webhook não estiver configurado corretamente. Verifique se o status do gateway aparece como "Conectado" no Dashboard.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
