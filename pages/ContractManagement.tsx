
import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
  FileDown,
  Share2,
  Calendar as CalendarIcon,
  DollarSign,
  ChevronRight,
  Sparkles,
  Printer,
  CalendarDays,
  User as UserIcon
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { generatePropertyDescription } from '../services/geminiService';

interface Contract {
  id: string;
  title: string;
  client: string;
  value: string;
  date: string;
  status: 'ACTIVE' | 'PENDING' | 'TERMINATED';
  propertyCode: string;
  model: string;
}

const INITIAL_CONTRACTS: Contract[] = [
  { id: '1', title: 'Locação Residencial - AP-001', client: 'Ricardo Almeida', value: '4.500,00', date: '10/10/2023', status: 'ACTIVE', propertyCode: 'AP-001', model: 'Locação Residencial' },
  { id: '2', title: 'Venda de Imóvel - CA-042', client: 'Carlos Ferreira', value: '3.450.000,00', date: '05/10/2023', status: 'PENDING', propertyCode: 'CA-042', model: 'Venda e Compra' },
  { id: '3', title: 'Locação Comercial - LJ-012', client: 'Tech Solutions LTDA', value: '12.000,00', date: '28/09/2023', status: 'TERMINATED', propertyCode: 'LJ-012', model: 'Locação Comercial' },
];

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [showGenerator, setShowGenerator] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    model: 'Locação Residencial',
    property: '',
    client: '',
    value: '',
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.property) newErrors.property = 'Selecione um imóvel';
    if (!formData.client) newErrors.client = 'Selecione um cliente';
    if (!formData.value) newErrors.value = 'Informe o valor';
    if (!formData.startDate) newErrors.startDate = 'Data de início é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePDF = (data: { client: string, property: string, value: string, model: string, startDate?: string, endDate?: string }) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 30;

    // Cabeçalho
    doc.setFillColor(30, 27, 75); // Slate-950
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Luís Imóveis', margin, 22);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('ERP IMOBILIÁRIO - DOCUMENTO OFICIAL AUTENTICADO', margin, 28);

    // Título
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(16);
    y = 55;
    doc.text(`INSTRUMENTO DE ${data.model.toUpperCase()}`, margin, y);
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y + 5, 190, y + 5);

    // Dados
    doc.setFontSize(10);
    y += 15;
    const items = [
      { t: 'CLIENTE:', d: data.client.toUpperCase() },
      { t: 'IMÓVEL:', d: `REF: ${data.property}` },
      { t: 'VALOR:', d: `R$ ${data.value}` },
      { t: 'EMISSÃO:', d: new Date().toLocaleDateString('pt-BR') }
    ];

    items.forEach(item => {
      doc.setFont('helvetica', 'bold');
      doc.text(item.t, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(item.d, margin + 40, y);
      y += 8;
    });

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('CONDIÇÕES GERAIS:', margin, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    
    const text = "Este documento serve como comprovante de intenção e registro contratual no sistema Luís Imóveis. As cláusulas completas seguem o padrão jurídico brasileiro para contratos de locação e venda, incluindo as obrigações de zelo, prazos de pagamento e foro de eleição.";
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, margin, y);

    y = 250;
    doc.line(margin, y, 90, y);
    doc.line(120, y, 190, y);
    doc.setFontSize(8);
    doc.text('Assinatura Digital Luís Imóveis', margin + 5, y + 5);
    doc.text(`Assinatura Cliente: ${data.client}`, 125, y + 5);

    doc.save(`Contrato_${data.property}_${data.client.replace(/\s+/g, '_')}.pdf`);
  };

  const handleGenerate = () => {
    if (validateForm()) {
      setIsProcessingPdf(true);
      setTimeout(() => {
        generatePDF({
          client: formData.client,
          property: formData.property,
          value: formData.value,
          model: formData.model
        });
        
        const newContract: Contract = {
          id: (contracts.length + 1).toString(),
          title: `${formData.model} - ${formData.property}`,
          client: formData.client,
          value: formData.value,
          date: new Date().toLocaleDateString('pt-BR'),
          status: 'ACTIVE',
          propertyCode: formData.property,
          model: formData.model
        };
        
        setContracts(prev => [newContract, ...prev]);
        setIsProcessingPdf(false);
        setShowGenerator(false);
        setFormData({ model: 'Locação Residencial', property: '', client: '', value: '', startDate: '', endDate: '' });
      }, 1000);
    }
  };

  const handleAction = (action: string, contract: Contract) => {
    if (action === 'print') {
      window.print();
      return;
    }

    if (action === 'download') {
      generatePDF({
        client: contract.client,
        property: contract.propertyCode,
        value: contract.value,
        model: contract.model
      });
      return;
    }

    if (action === 'send') {
      const msg = encodeURIComponent(`Olá ${contract.client}, segue o link para assinatura do seu contrato (${contract.title}): https://luisimoveis.com.br/auth/sign/${contract.id}`);
      window.open(`https://wa.me/5511999999999?text=${msg}`, '_blank');
      return;
    }
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.propertyCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [contracts, statusFilter, searchTerm]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Contratos</h1>
          <p className="text-slate-500 font-medium">Controle jurídico, automação e assinaturas digitais.</p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Printer size={20} />
            Imprimir Lista
          </button>
          <button 
            onClick={() => setShowGenerator(true)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Novo Contrato
          </button>
        </div>
      </div>

      {showGenerator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300 no-print">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center shrink-0">
               <div>
                <h3 className="font-black text-2xl tracking-tight">Gerador de Contratos</h3>
                <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Instrumentos Particulares Oficiais</p>
               </div>
               <button onClick={() => setShowGenerator(false)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <X size={24} />
               </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modelo Base</label>
                  <select name="model" value={formData.model} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                    <option>Locação Residencial</option>
                    <option>Venda e Compra</option>
                    <option>Locação Comercial</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>Imóvel Vinculado</span>
                    {errors.property && <span className="text-rose-500 text-[9px] font-black">Obrigatório</span>}
                  </label>
                  <select name="property" value={formData.property} onChange={handleInputChange} className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none transition-all ${errors.property ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'}`}>
                    <option value="">Selecione...</option>
                    <option value="AP-001">AP-001 - Apartamento Luxo Moema</option>
                    <option value="CA-042">CA-042 - Casa Condomínio Alphaville</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>Cliente</span>
                    {errors.client && <span className="text-rose-500 text-[9px] font-black">Obrigatório</span>}
                  </label>
                  <select name="client" value={formData.client} onChange={handleInputChange} className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none transition-all ${errors.client ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'}`}>
                    <option value="">Selecione...</option>
                    <option value="Marina Santos">Marina Santos</option>
                    <option value="Ricardo Almeida">Ricardo Almeida</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Financeiro</label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" name="value" value={formData.value} onChange={handleInputChange} placeholder="0,00" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none transition-all focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Início</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-indigo-500" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Término</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 flex gap-4 shrink-0 bg-slate-50/50">
              <button onClick={() => setShowGenerator(false)} className="flex-1 py-4 bg-white text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px] border border-slate-200">Descartar</button>
              <button onClick={handleGenerate} disabled={isProcessingPdf} className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                {isProcessingPdf ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
                Gerar e Publicar (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 no-print">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 relative min-w-[300px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input type="text" placeholder="Pesquisar contratos ativos..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          
          <select className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">Status: Todos</option>
            <option value="ACTIVE">Ativos</option>
            <option value="PENDING">Pendentes</option>
            <option value="TERMINATED">Encerrados</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredContracts.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-6 group hover:border-indigo-300 transition-all duration-300">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
              <FileText size={28} />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-1">
                <h3 className="text-lg font-black text-slate-900">{c.title}</h3>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : c.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  {c.status === 'ACTIVE' ? 'Ativo' : c.status === 'PENDING' ? 'Assinando' : 'Encerrado'}
                </span>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                <span className="flex items-center gap-1.5"><CalendarIcon size={12}/> {c.date}</span>
                <span className="flex items-center gap-1.5"><UserIcon size={12}/> {c.client}</span>
                <span className="text-indigo-600">R$ {c.value}</span>
              </div>
            </div>
            <div className="flex gap-2 no-print">
              <button onClick={() => handleAction('download', c)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-white hover:text-indigo-600 border border-transparent hover:border-indigo-100 transition-all shadow-sm active:scale-90" title="Baixar PDF Oficial"><Download size={20} /></button>
              <button onClick={() => handleAction('send', c)} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-slate-950 transition-all shadow-lg shadow-indigo-100 active:scale-90" title="Compartilhar via WhatsApp"><Share2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractManagement;
