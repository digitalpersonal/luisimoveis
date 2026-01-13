
import React, { useState, useEffect } from 'react';
import { UserCircle, Key, FileText, Download, MessageSquare, CreditCard, ChevronRight, Bell, Sparkles, Copy, Check, Loader2, QrCode, TrendingDown, AlertCircle } from 'lucide-react';
import { calculateOverdueValues, createMercadoPagoPix, simulateWebhookConfirmation } from '../services/paymentService';

const ClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [showPixModal, setShowPixModal] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'qrcode' | 'success'>('details');

  // Dados fictícios do aluguel atual
  // Exemplo de valor nominal: R$ 5.000,00 -> Com desconto: R$ 4.500,00
  const rentalDetails = {
    propertyCode: 'AP-001',
    nominalValue: 5000, 
    dueDate: '2023-11-10', 
    clientName: 'Marina Santos'
  };

  const invoice = calculateOverdueValues(rentalDetails.nominalValue, rentalDetails.dueDate);

  const handleStartPix = async () => {
    setLoadingPix(true);
    const data = await createMercadoPagoPix(invoice.totalValue, `Aluguel ${rentalDetails.propertyCode}`);
    setPixData(data);
    setLoadingPix(false);
    setPaymentStep('qrcode');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixData.qr_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    simulateWebhookConfirmation(rentalDetails.clientName, invoice.totalValue, rentalDetails.propertyCode);
    setPaymentStep('success');
    setTimeout(() => {
      setShowPixModal(false);
      setPaymentStep('details');
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="bg-indigo-950 p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <UserCircle size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500 flex items-center justify-center font-black text-2xl shadow-xl">
            MS
          </div>
          <div>
            <h1 className="text-3xl font-black mb-1">Olá, {rentalDetails.clientName}</h1>
            <p className="text-indigo-200 font-medium">Seu acesso exclusivo à administração do seu imóvel.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'payments', label: 'Financeiro / Boletos', icon: <CreditCard size={18}/> },
            { id: 'contracts', label: 'Meus Contratos', icon: <FileText size={18}/> },
            { id: 'reports', label: 'Informe de Rendimentos', icon: <PieChart size={18}/> },
            { id: 'support', label: 'Solicitar Reparo', icon: <MessageSquare size={18}/> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Valor para Pagamento</p>
                    {invoice.isOverdue ? (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded uppercase flex items-center gap-1 border border-rose-100">
                        <AlertCircle size={10} /> Pontualidade Expirada
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded uppercase flex items-center gap-1 border border-emerald-100">
                        <TrendingDown size={10} /> Desconto Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-4xl font-black text-slate-900">R$ {invoice.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className={`text-xs font-bold mt-2 ${invoice.isOverdue ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {invoice.isOverdue 
                      ? `Atrasado há ${invoice.daysOverdue} dias. Valores corrigidos sobre o nominal.` 
                      : `Aproveite seu desconto de R$ ${invoice.discount.toFixed(2)} pagando até ${new Date(invoice.dueDate).toLocaleDateString()}`}
                  </p>
                </div>
                <button 
                  onClick={() => setShowPixModal(true)}
                  className="flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group"
                >
                  <QrCode size={24} className="group-hover:rotate-12 transition-transform" /> Pagar via Pix
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Histórico de Mensalidades</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {['Outubro', 'Setembro'].map((month, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Download size={18}/></div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Aluguel Ref. {month}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Liquidado via Pix</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-900">R$ 4.500,00</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">Checkout do Aluguel</h3>
              <button onClick={() => setShowPixModal(false)} className="text-indigo-200 hover:text-white transition-colors">
                <ChevronRight className="rotate-90" />
              </button>
            </div>

            <div className="p-8">
              {paymentStep === 'details' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Valor Nominal</span>
                      <span className="text-slate-900 font-bold">R$ {invoice.originalValue.toFixed(2)}</span>
                    </div>
                    
                    {!invoice.isOverdue ? (
                      <div className="flex justify-between text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        <span className="font-bold">Desconto Pontualidade</span>
                        <span className="font-black">- R$ {invoice.discount.toFixed(2)}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm text-rose-600">
                          <span className="font-medium">Multa Atraso (2%)</span>
                          <span className="font-bold">+ R$ {invoice.fine.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-rose-600">
                          <span className="font-medium">Juros Mora ({invoice.daysOverdue} dias)</span>
                          <span className="font-bold">+ R$ {invoice.interest.toFixed(2)}</span>
                        </div>
                        <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-[10px] text-rose-600 font-bold uppercase text-center mt-2">
                          Benefício de pontualidade perdido
                        </div>
                      </>
                    )}

                    <div className="h-px bg-slate-100 my-4"></div>
                    <div className="flex justify-between text-xl">
                      <span className="text-slate-900 font-black">Total a Pagar</span>
                      <span className="text-indigo-600 font-black underline underline-offset-4 decoration-indigo-200">R$ {invoice.totalValue.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleStartPix}
                    disabled={loadingPix}
                    className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                  >
                    {loadingPix ? <Loader2 className="animate-spin" size={20} /> : 'Confirmar e Gerar Pix'}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                    <Sparkles size={10} /> Segurança Mercado Pago
                  </p>
                </div>
              )}

              {paymentStep === 'qrcode' && (
                <div className="text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="relative group p-4 bg-slate-50 rounded-3xl inline-block border-2 border-dashed border-slate-200">
                    <img src={pixData.qr_code_base64} alt="Pix QR Code" className="w-48 h-48" />
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
                       <Check className="text-indigo-600" size={32} strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <p className="text-xs text-slate-500 font-medium text-center px-4 leading-relaxed">Escaneie o QR Code ou copie a chave Pix abaixo no app do seu banco preferido.</p>
                    
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono truncate select-all">
                        {pixData.qr_code}
                      </div>
                      <button 
                        onClick={handleCopyPix}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
                        title="Copiar código"
                      >
                        {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleSimulatePayment}
                    className="w-full py-4 border-2 border-indigo-600 text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all active:scale-95"
                  >
                    Já realizei o pagamento
                  </button>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center space-y-4 py-8 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50 shadow-inner">
                    <Check size={48} strokeWidth={3} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">Aluguel Liquidado!</h4>
                  <p className="text-slate-500 text-sm leading-relaxed px-4">Seu pagamento foi confirmado via Pix. O proprietário e o setor financeiro já receberam a notificação.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PieChart = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
);

export default ClientPortal;
