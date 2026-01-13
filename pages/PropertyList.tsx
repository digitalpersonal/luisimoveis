
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  MoreVertical, 
  Edit, 
  Trash, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  DollarSign,
  CheckCircle2,
  Car,
  Sofa,
  UtensilsCrossed,
  Square,
  FileText,
  Loader2,
  Image as ImageIcon,
  Star,
  Layers,
  Info,
  Tv,
  Waves,
  Pocket,
  ArrowUpCircle,
  ShieldCheck,
  TreePine,
  Box,
  PlusCircle,
  Tag,
  Coins
} from 'lucide-react';
import { PropertyStatus, PropertyType, DealType } from '../types';

const ITEMS_PER_PAGE = 8;
const MAX_PHOTOS = 12;

const GENERATE_MOCK_PROPERTIES = () => {
  const baseProperties = [
    {
      code: 'AP',
      title: 'Apartamento Luxo Vila Nova',
      address: 'Av. Brasil, 1200 - Jardins',
      price: 1250000,
      rent: 4500,
      type: PropertyType.RESIDENTIAL,
      dealType: DealType.BOTH,
      beds: 3,
      suites: 1,
      baths: 2,
      parking: 2,
      area: 120,
      image: 'https://picsum.photos/seed/apt1/800/600'
    },
    {
      code: 'CA',
      title: 'Casa de Condomínio Moderna',
      address: 'Rua das Flores, 45 - Alphaville',
      price: 3450000,
      type: PropertyType.RESIDENTIAL,
      dealType: DealType.SALE,
      beds: 4,
      suites: 2,
      baths: 5,
      parking: 4,
      area: 380,
      image: 'https://picsum.photos/seed/house1/800/600'
    },
    {
      code: 'CM',
      title: 'Laje Corporativa Faria Lima',
      address: 'Av. Faria Lima, 3500 - Itaim Bibi',
      rent: 28000,
      type: PropertyType.COMMERCIAL,
      dealType: DealType.RENT,
      beds: 0,
      suites: 0,
      baths: 4,
      parking: 10,
      area: 450,
      image: 'https://picsum.photos/seed/comm1/800/600'
    }
  ];

  const statuses = [PropertyStatus.AVAILABLE, PropertyStatus.RENTED, PropertyStatus.SOLD, PropertyStatus.RESERVED];
  
  return Array.from({ length: 32 }).map((_, i) => {
    const base = baseProperties[i % baseProperties.length];
    return {
      ...base,
      id: (i + 1).toString(),
      code: `${base.code}-${(100 + i).toString()}`,
      title: `${base.title} #${i + 1}`,
      status: statuses[i % statuses.length],
      image: `https://picsum.photos/seed/prop${i}/800/600`
    };
  });
};

const MOCK_PROPERTIES = GENERATE_MOCK_PROPERTIES();

const PropertyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [selectedDealType, setSelectedDealType] = useState<DealType>(DealType.SALE);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType>(PropertyType.RESIDENTIAL);
  
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter(prop => {
      const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prop.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || prop.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const getStatusBadge = (status: PropertyStatus) => {
    const styles: any = {
      [PropertyStatus.AVAILABLE]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      [PropertyStatus.RENTED]: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      [PropertyStatus.SOLD]: 'bg-slate-100 text-slate-700 border-slate-200',
      [PropertyStatus.RESERVED]: 'bg-amber-50 text-amber-700 border-amber-100',
    };
    const labels: any = {
      [PropertyStatus.AVAILABLE]: 'Disponível',
      [PropertyStatus.RENTED]: 'Alugado',
      [PropertyStatus.SOLD]: 'Vendido',
      [PropertyStatus.RESERVED]: 'Reservado',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 1200;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    if (uploadedPhotos.length + files.length > MAX_PHOTOS) {
      alert(`Limite máximo de ${MAX_PHOTOS} fotos atingido.`);
      return;
    }

    setIsProcessingPhotos(true);
    const processed = await Promise.all(files.map(file => compressImage(file)));
    setUploadedPhotos(prev => [...prev, ...processed]);
    setIsProcessingPhotos(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      setUploadedPhotos([]);
      alert('Imóvel cadastrado com sucesso e integrado ao portal público!');
    }, 1200);
  };

  const handleAction = (type: string, id: string) => {
    if (type === 'delete') {
      if (confirm('Deseja realmente excluir este imóvel? Esta ação não pode ser desfeita.')) {
        alert('Imóvel removido com sucesso.');
      }
    } else if (type === 'edit') {
      setShowModal(true);
    } else if (type === 'view') {
      alert('Abrindo visualização detalhada para o portal do cliente...');
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Carteira de Imóveis</h1>
          <p className="text-slate-500 font-medium">Gerencie o acervo da imobiliária com facilidade.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} /> Novo Imóvel
        </button>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 relative min-w-[300px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por código, bairro ou condomínio..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert('Filtros Avançados: Em breve.')} className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors active:scale-95">
            <Filter size={18} /> Filtros
          </button>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer"
          >
            <option value="ALL">Todos os tipos</option>
            <option value={PropertyType.RESIDENTIAL}>Residencial</option>
            <option value={PropertyType.COMMERCIAL}>Comercial</option>
            <option value={PropertyType.INDUSTRIAL}>Industrial</option>
            <option value={PropertyType.LAND}>Terreno</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentItems.map((prop) => (
          <div key={prop.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-500 flex flex-col">
            <div className="relative h-56 overflow-hidden">
              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 z-10">{getStatusBadge(prop.status)}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                <button onClick={() => handleAction('view', prop.id)} className="w-full py-2.5 bg-white text-slate-900 font-black rounded-xl text-xs uppercase tracking-widest shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 active:scale-95">Visualizar Completo</button>
              </div>
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button onClick={() => handleAction('edit', prop.id)} className="p-2.5 bg-white/95 backdrop-blur rounded-xl shadow-xl hover:bg-indigo-600 hover:text-white transition-all text-slate-700 active:scale-90"><Edit size={16} /></button>
                <button onClick={() => handleAction('delete', prop.id)} className="p-2.5 bg-white/95 backdrop-blur rounded-xl shadow-xl hover:bg-rose-600 hover:text-white transition-all text-slate-700 active:scale-90"><Trash size={16} /></button>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                   <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded uppercase tracking-tighter">{prop.code}</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{prop.type}</span>
                </div>
                <h3 className="font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors text-lg truncate">{prop.title}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-xs mt-2 font-medium">
                  <MapPin size={14} className="text-indigo-500" />
                  <span className="truncate">{prop.address}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl mb-6 shadow-inner">
                <div className="flex flex-col items-center gap-1.5">
                  <Bed size={20} className="text-indigo-500" />
                  <span className="text-xs font-black text-slate-700">{prop.beds} Dorms</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 border-x border-slate-200 px-1">
                  <Bath size={20} className="text-indigo-500" />
                  <span className="text-xs font-black text-slate-700">{prop.baths} BHs</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Maximize size={20} className="text-indigo-500" />
                  <span className="text-xs font-black text-slate-700">{prop.area}m²</span>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="space-y-0.5">
                  {(prop.dealType === DealType.SALE || prop.dealType === DealType.BOTH) && prop.price && (
                    <p className="text-xl font-black text-emerald-600">R$ {prop.price.toLocaleString('pt-BR')}<span className="text-[9px] text-slate-400 block font-black uppercase tracking-widest leading-none">Venda</span></p>
                  )}
                  {(prop.dealType === DealType.RENT || prop.dealType === DealType.BOTH) && prop.rent && (
                    <p className="text-xl font-black text-indigo-600">R$ {prop.rent.toLocaleString('pt-BR')}<span className="text-[9px] text-slate-400 block font-black uppercase tracking-widest leading-none">Aluguel/mês</span></p>
                  )}
                </div>
                <button onClick={() => window.open('/portal', '_blank')} className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all text-slate-400 group/btn active:scale-95">
                  <ExternalLink size={20} className="group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-12 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 font-bold">Mostrando <span className="text-indigo-600">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> a <span className="text-indigo-600">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)}</span> de <span className="text-slate-900">{filteredProperties.length}</span> imóveis</p>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-3 border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-90"><ChevronLeft size={20} /></button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`w-11 h-11 rounded-2xl text-xs font-black transition-all active:scale-90 ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-xl scale-110' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}>{i + 1}</button>
              ))}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-90"><ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center shrink-0">
               <div>
                <h3 className="font-black text-2xl tracking-tight">Cadastro Detalhado de Unidade</h3>
                <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Gestão Completa de Inventário</p>
               </div>
               <button onClick={() => setShowModal(false)} className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors active:scale-95">
                <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSave} className="p-8 overflow-y-auto custom-scrollbar space-y-12 flex-1">
              {/* Seção 1: Informações Básicas e Localização */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-50 pb-2">Localização e Identificação</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título do Anúncio</label>
                    <input required type="text" placeholder="Ex: Casa Moderna com Piscina e Área Gourmet" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers size={14}/> Tipo de Imóvel
                    </label>
                    <select 
                      value={selectedPropertyType} 
                      onChange={(e) => setSelectedPropertyType(e.target.value as PropertyType)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value={PropertyType.RESIDENTIAL}>Residencial</option>
                      <option value={PropertyType.COMMERCIAL}>Comercial</option>
                      <option value={PropertyType.INDUSTRIAL}>Industrial</option>
                      <option value={PropertyType.LAND}>Terreno / Lote</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código Ref.</label>
                    <input required type="text" placeholder="Ex: CA-001" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>

                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereço Completo</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required type="text" placeholder="Logradouro, número, bairro, cidade - UF" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2: Negociação e Valores */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-50 pb-2">Negociação e Valores</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Tag size={14}/> Finalidade
                    </label>
                    <select 
                      value={selectedDealType} 
                      onChange={(e) => setSelectedDealType(e.target.value as DealType)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value={DealType.SALE}>Venda</option>
                      <option value={DealType.RENT}>Aluguel</option>
                      <option value={DealType.BOTH}>Ambos (Venda/Aluguel)</option>
                    </select>
                  </div>

                  {(selectedDealType === DealType.SALE || selectedDealType === DealType.BOTH) && (
                    <div className="space-y-1.5 animate-in slide-in-from-left-2">
                      <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Coins size={14}/> Valor de Venda
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">R$</span>
                        <input type="number" step="0.01" placeholder="0,00" className="w-full pl-10 pr-4 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm font-black text-emerald-700 outline-none" />
                      </div>
                    </div>
                  )}

                  {(selectedDealType === DealType.RENT || selectedDealType === DealType.BOTH) && (
                    <div className="space-y-1.5 animate-in slide-in-from-left-2">
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Coins size={14}/> Valor de Aluguel
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">R$</span>
                        <input type="number" step="0.01" placeholder="0,00" className="w-full pl-10 pr-4 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm font-black text-indigo-700 outline-none" />
                      </div>
                    </div>
                  )}

                  {(selectedDealType === DealType.RENT || selectedDealType === DealType.BOTH) && (
                    <div className="space-y-1.5 animate-in slide-in-from-left-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Condomínio (Mensal)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">R$</span>
                        <input type="number" step="0.01" placeholder="0,00" className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 3: Inventário Granular de Cômodos */}
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-100 pb-2">Composição de Cômodos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                  {[
                    { label: 'Cozinhas', icon: <UtensilsCrossed size={14}/> },
                    { label: 'Salas', icon: <Sofa size={14}/> },
                    { label: 'Salas de TV', icon: <Tv size={14}/> },
                    { label: 'Quartos', icon: <Bed size={14}/> },
                    { label: 'Suítes', icon: <Star size={14}/> },
                    { label: 'Banheiros', icon: <Bath size={14}/> },
                    { label: 'Vagas Garagem', icon: <Car size={14}/> },
                    { label: 'Área Serviço', icon: <Pocket size={14}/> },
                    { label: 'Cômodo Ext.', icon: <Box size={14}/> }
                  ].map(f => (
                    <div key={f.label} className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        {f.icon} {f.label}
                      </label>
                      <input type="number" min="0" defaultValue="0" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                  ))}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Maximize size={14}/> Área Total (m²)
                    </label>
                    <input type="number" min="0" placeholder="0" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
              </div>

              {/* Seção 4: Infraestrutura, Pavimentos e Lazer */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-50 pb-2">Infraestrutura e Lazer</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ArrowUpCircle size={14}/> Pavimentos / Andares
                    </label>
                    <div className="flex gap-2">
                      {['Térrea', '2 Andares', '3+ Andares'].map(p => (
                        <button type="button" key={p} className="flex-1 py-3 px-2 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-tighter hover:bg-indigo-50 hover:border-indigo-200 transition-all active:scale-95 bg-white">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Segurança e Extras
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-emerald-500" /> Portão Eletrônico
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-500 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
                          <Waves size={14} className="text-indigo-500" /> Piscina
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <TreePine size={14}/> Área Externa
                    </label>
                    <input type="text" placeholder="Ex: Quintal gramado, Jardim frontal..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* Seção 5: Campos de Texto e Personalização */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-50 pb-2">Personalização e Notas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <PlusCircle size={14}/> Outros Itens / Benfeitorias
                    </label>
                    <input type="text" placeholder="Ex: Ar condicionado em todos os quartos, Placas solares..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Info size={14}/> Observações Críticas (Equipe Interna)
                    </label>
                    <textarea 
                      rows={3} 
                      placeholder="Detalhes jurídicos, restrições de horários para visitas, perfil do proprietário..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Seção 6: Mídia */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-50 pb-2">Galeria de Fotos</h4>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                  {uploadedPhotos.length < MAX_PHOTOS && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-600 group active:scale-95">
                      <Camera size={24} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Adicionar</span>
                    </button>
                  )}
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative group shadow-sm border border-slate-100">
                      <img src={photo} className="w-full h-full object-cover" alt="Preview" />
                      <button type="button" onClick={() => removePhoto(index)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity active:scale-90">
                        <Trash size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações Finais */}
              <div className="pt-8 border-t border-slate-100 flex gap-4 shrink-0 bg-white sticky bottom-0 z-10">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px] border border-slate-200 active:scale-95">
                  Descartar Alterações
                </button>
                <button type="submit" disabled={isSaving} className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} 
                  Salvar Unidade no Sistema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
