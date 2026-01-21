
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
  FileDown,
  Share2,
  Calendar as CalendarIcon,
  DollarSign,
  ChevronRight,
  Sparkles,
  Printer,
  CalendarDays,
  User as UserIcon,
  Building,
  Settings2,
  Copy,
  Save,
  Trash2,
  Type
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ContractTemplate {
  id: string;
  name: string;
  content: string;
  type: 'RENT' | 'SALE';
}

interface Contract {
  id: string;
  title: string;
  client: string;
  owner: string;
  value: string;
  date: string;
  status: 'ACTIVE' | 'PENDING' | 'TERMINATED';
  propertyCode: string;
  model: string;
}

const DEFAULT_TEMPLATES: ContractTemplate[] = [
  {
    id: '1',
    name: 'Locação Residencial Padrão',
    type: 'RENT',
    content: `CONTRATO DE LOCAÇÃO RESIDENCIAL\n\nLOCADOR: {{PROPRIETARIO}}\nLOCATÁRIO: {{CLIENTE}}\nIMÓVEL: {{IMOVEL}}\nVALOR MENSAL: R$ {{VALOR}}\n\nCLÁUSULA PRIMEIRA: O prazo de locação é de 30 meses...\n\nCLÁUSULA SEGUNDA: O pagamento deverá ser feito todo dia 10...\n\nCLÁUSULA TERCEIRA (MULTA): O atraso implicará em multa de 2%...`
  },
  {
    id: '2',
    name: 'Venda e Compra - Guaranésia',
    type: 'SALE',
    content: `INSTRUMENTO PARTICULAR DE COMPRA E VENDA\n\nVENDEDOR: {{PROPRIETARIO}}\nCOMPRADOR: {{CLIENTE}}\nOBJETO: {{IMOVEL}}\nVALOR TOTAL: R$ {{VALOR}}\n\nCLÁUSULA 1: O comprador declara ter vistoriado o imóvel...\n\nCLÁUSULA 2: A escritura definitiva será lavrada após a quitação...`
  }
];

const INITIAL_CONTRACTS: Contract[] = [
  { id: '1', title: 'Locação Residencial - AP-001', client: 'Marina Santos', owner: 'Ricardo Almeida', value: '4.500,00', date: '10/10/2023', status: 'ACTIVE', propertyCode: 'AP-001', model: 'Locação Residencial Padrão' },
];

const ContractManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates'>('contracts');
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [templates, setTemplates] = useState<ContractTemplate[]>(DEFAULT_TEMPLATES);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Template Editor State
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);

  const [formData, setFormData] = useState({
    templateId: '1',
    property: '',
    client: '',
    owner: '',
    value: '',
    startDate: '',
    endDate: '',
    customText: '' // Texto final que será gerado
  });

  const generatePDF = (title: string, content: string) => {
    const doc = new jsPDF();
    const margin = 20;
    
    // Header
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Luís Imóveis - Guaranésia', margin, 20);
    
    // Body
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), margin, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, margin, 60);

    // Footer
    doc.setFontSize(8);
    doc.text(`Documento gerado em ${new Date().toLocaleString()} - Autenticidade garantida pelo ERP Luís Imóveis.`, margin, 285);

    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  const handleCreateContract = () => {
    const template = templates.find(t => t.id === formData.templateId);
    if (!template) return;

    // Substituir variáveis dinâmicas
    let finalContent = template.content
      .replace(/{{CLIENTE}}/g, formData.client)
      .replace(/{{PROPRIETARIO}}/g, formData.owner)
      .replace(/{{IMOVEL}}/g, formData.property)
      .replace(/{{VALOR}}/g, formData.value);

    setIsProcessingPdf(true);
    setTimeout(() => {
      generatePDF(`Contrato ${formData.property}`, finalContent);
      
      const newContract: Contract = {
        id: Date.now().toString(),
        title: `${template.name} - ${formData.property}`,
        client: formData.client,
        owner: formData.owner,
        value: formData.value,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'PENDING',
        propertyCode: formData.property,
        model: template.name
      };
      
      setContracts([newContract, ...contracts]);
      setIsProcessingPdf(false);
      setShowGenerator(false);
    }, 1200);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      if (editingTemplate.id === 'new') {
        const newId = Date.now().toString();
        setTemplates([...templates, { ...editingTemplate, id: newId }]);
      } else {
        setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
      }
      setEditingTemplate(null);
      alert('Modelo de contrato salvo com sucesso!');
    }
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.client.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [contracts, statusFilter, searchTerm]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header com Abas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Jurídico & Contratos</h1>
          <p className="text-slate-500 font-medium">Gestão de instrumentos particulares e modelos padrão.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm no-print">
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'contracts' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Contratos
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'templates' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Modelos de Cláusulas
          </button>
        </div>
      </div>

      {activeTab === 'contracts' ? (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
          {/* Busca e Filtros */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-wrap gap-4 items-center shadow-sm">
            <div className="flex-1 relative min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Buscar contratos..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowGenerator(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              <Plus size={18} /> Novo Contrato
            </button>
          </div>

          {/* Lista de Contratos */}
          <div className="grid grid-cols-1 gap-4">
            {filteredContracts.map((c) => (
              <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-indigo-300 transition-all">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <FileText size={28} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-black text-slate-900 mb-1">{c.title}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    <span className="flex items-center gap-1.5"><UserIcon size={12}/> {c.client}</span>
                    <span className="flex items-center gap-1.5"><Building size={12}/> {c.owner}</span>
                    <span className="text-indigo-600 font-black">R$ {c.value}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => generatePDF(c.title, "Conteúdo recuperado do arquivo...")} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all" title="Baixar"><Download size={20}/></button>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all" title="WhatsApp"><Share2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
          {/* Listagem de Modelos */}
          <div className="lg:col-span-1 space-y-4">
            <button 
              onClick={() => setEditingTemplate({ id: 'new', name: '', content: '', type: 'RENT' })}
              className="w-full p-6 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all active:scale-95"
            >
              <PlusCircleIcon size={32} />
              <span className="text-xs font-black uppercase tracking-widest">Novo Modelo de Cláusulas</span>
            </button>

            {templates.map(t => (
              <div 
                key={t.id} 
                onClick={() => setEditingTemplate(t)}
                className={`p-6 rounded-[2rem] border cursor-pointer transition-all ${editingTemplate?.id === t.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl ${editingTemplate?.id === t.id ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Type size={18} />
                  </div>
                  <h4 className="font-black text-sm tracking-tight">{t.name}</h4>
                </div>
                <p className={`text-[10px] font-medium line-clamp-2 ${editingTemplate?.id === t.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {t.content.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>

          {/* Editor de Modelo */}
          <div className="lg:col-span-2">
            {editingTemplate ? (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-full animate-in zoom-in-95 duration-300">
                <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-xl tracking-tight">Editor de Cláusulas</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Personalize seus contratos padrão</p>
                  </div>
                  <button onClick={() => setEditingTemplate(null)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24}/></button>
                </div>
                
                <div className="p-8 flex-1 flex flex-col space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Modelo</label>
                    <input 
                      type="text" 
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                      placeholder="Ex: Contrato de Locação Residencial - Sem Fiador"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Corpo do Contrato / Cláusulas</label>
                      <div className="flex gap-2">
                         <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black rounded text-slate-500">{"{{CLIENTE}}"}</span>
                         <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black rounded text-slate-500">{"{{VALOR}}"}</span>
                      </div>
                    </div>
                    <textarea 
                      value={editingTemplate.content}
                      onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                      placeholder="Cole aqui as cláusulas do seu contrato atual..."
                      className="w-full flex-1 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex gap-4">
                    <button onClick={() => setEditingTemplate(null)} className="flex-1 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">Cancelar</button>
                    <button onClick={handleSaveTemplate} className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <Save size={18} /> Salvar Modelo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                <Settings2 size={48} className="text-slate-200 mb-4" />
                <h4 className="font-black text-slate-400 uppercase tracking-widest text-sm">Selecione ou crie um modelo</h4>
                <p className="text-xs text-slate-400 mt-2 max-w-xs">Gerencie os textos padrão que a imobiliária já utiliza para automatizar a geração de novos contratos.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Geração (Melhorado) */}
      {showGenerator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-2xl tracking-tight">Preencher Novo Contrato</h3>
                <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Os dados serão fundidos ao modelo escolhido</p>
              </div>
              <button onClick={() => setShowGenerator(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24}/></button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Escolher Modelo Jurídico</label>
                  <select 
                    value={formData.templateId} 
                    onChange={(e) => setFormData({...formData, templateId: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Imóvel (Código/Ref)</label>
                  <input type="text" placeholder="Ex: AP-001" value={formData.property} onChange={(e) => setFormData({...formData, property: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente (Inquilino/Comprador)</label>
                  <input type="text" placeholder="Nome Completo" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proprietário</label>
                  <input type="text" placeholder="Nome do Proprietário" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor do Negócio (R$)</label>
                  <input type="text" placeholder="0.000,00" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                 <Sparkles className="text-amber-600 shrink-0" size={24} />
                 <p className="text-xs text-amber-800 font-medium leading-relaxed">
                   <b>Dica Luís Imóveis:</b> Os campos acima preencherão automaticamente as variáveis <code>{"{{CLIENTE}}"}</code>, <code>{"{{IMOVEL}}"}</code>, etc. no modelo de PDF final. Você não precisa digitar o contrato inteiro toda vez.
                 </p>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white flex gap-4">
              <button onClick={() => setShowGenerator(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">Cancelar</button>
              <button 
                onClick={handleCreateContract}
                disabled={isProcessingPdf}
                className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isProcessingPdf ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
                Gerar e Assinar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PlusCircleIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

export default ContractManagement;
