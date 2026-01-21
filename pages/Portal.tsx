
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Maximize, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Menu,
  X,
  Car,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  FileSearch,
  Loader2,
  Heart,
  Share2,
  Calendar,
  RefreshCw,
  SearchX,
  Tag
} from 'lucide-react';

const PORTAL_PROPERTIES = [
  { 
    id: '1', 
    title: 'Casa de Alto Padrão - Vila Betel', 
    loc: 'Vila Betel, Guaranésia', 
    price: 'R$ 850.000', 
    beds: 3, 
    baths: 3, 
    area: 250, 
    parking: 2,
    type: 'RESIDENTIAL',
    img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', 
    tag: 'Venda', 
    description: 'Linda casa com acabamento premium, suíte master com closet e área gourmet integrada.' 
  },
  { 
    id: '2', 
    title: 'Apartamento Central Próximo à Praça', 
    loc: 'Centro, Guaranésia', 
    price: 'R$ 1.800/mês', 
    beds: 2, 
    baths: 1, 
    area: 85, 
    parking: 1,
    type: 'RESIDENTIAL',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 
    tag: 'Aluguel', 
    description: 'Apartamento arejado, no coração da cidade. Segurança 24h e baixo custo de condomínio.' 
  },
  { 
    id: '3', 
    title: 'Loteamento Residencial Novo', 
    loc: 'Jardim Primavera, Guaranésia', 
    price: 'R$ 120.000', 
    beds: 0, 
    baths: 0, 
    area: 300, 
    parking: 0,
    type: 'LAND',
    img: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80', 
    tag: 'Venda', 
    description: 'Lote plano pronto para construir, infraestrutura completa e excelente valorização.' 
  },
  { 
    id: '4', 
    title: 'Casa com Área Gourmet Completa', 
    loc: 'Vila Rica, Guaranésia', 
    price: 'R$ 2.500/mês', 
    beds: 4, 
    baths: 2, 
    area: 180, 
    parking: 2,
    type: 'RESIDENTIAL',
    img: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&w=800&q=80', 
    tag: 'Aluguel', 
    description: 'Ideal para famílias que buscam conforto. Quintal amplo e churrasqueira profissional.' 
  },
  { 
    id: '5', 
    title: 'Ponto Comercial - Centro', 
    loc: 'Centro, Guaranésia', 
    price: 'R$ 4.500/mês', 
    beds: 0, 
    baths: 2, 
    area: 120, 
    parking: 3,
    type: 'COMMERCIAL',
    img: 'https://images.unsplash.com/photo-1582030024464-3259b6c0792a?auto=format&fit=crop&w=800&q=80', 
    tag: 'Aluguel', 
    description: 'Salão amplo para comércio ou escritório, excelente visibilidade e localização privilegiada.' 
  },
];

const Portal: React.FC = () => {
  const navigate = useNavigate();
  const [dealType, setDealType] = useState<'SALE' | 'RENT'>('SALE');
  const [propertyType, setPropertyType] = useState('ALL');
  const [bedrooms, setBedrooms] = useState('any');
  const [parking, setParking] = useState('any');
  const [locationSearch, setLocationSearch] = useState('');
  
  // Inicializar com filtro de venda já aplicado
  const [filteredResults, setFilteredResults] = useState(
    PORTAL_PROPERTIES.filter(p => p.tag === 'Venda')
  );
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; 
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    setTimeout(() => {
      const results = PORTAL_PROPERTIES.filter(p => {
        const matchesDeal = (dealType === 'SALE' && p.tag === 'Venda') || (dealType === 'RENT' && p.tag === 'Aluguel');
        const matchesType = propertyType === 'ALL' || p.type === propertyType;
        const matchesBeds = bedrooms === 'any' || p.beds >= parseInt(bedrooms);
        const matchesParking = parking === 'any' || p.parking >= parseInt(parking);
        const matchesLocation = locationSearch === '' || 
                               p.loc.toLowerCase().includes(locationSearch.toLowerCase()) || 
                               p.title.toLowerCase().includes(locationSearch.toLowerCase());
        
        return matchesDeal && matchesType && matchesBeds && matchesParking && matchesLocation;
      });

      setFilteredResults(results);
      setIsSearching(false);
      
      if (window.innerWidth < 768) {
        scrollToSection('destaques');
      }
    }, 400);
  };

  // Disparar busca ao trocar tipo de negócio
  useEffect(() => {
    handleSearch();
  }, [dealType]);

  const clearFilters = () => {
    setDealType('SALE');
    setPropertyType('ALL');
    setBedrooms('any');
    setParking('any');
    setLocationSearch('');
    setFilteredResults(PORTAL_PROPERTIES.filter(p => p.tag === 'Venda'));
  };

  const handleWhatsAppContact = (msg: string = "Olá, vi um imóvel no site e gostaria de mais informações.") => {
    const phone = "5535999990000";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Header Fixo */}
      <nav className="fixed top-0 left-0 right-0 z-[60] px-4 md:px-8 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="p-1.5 md:p-2 bg-indigo-600 rounded-xl text-white shadow-lg">
            <Home size={18} />
          </div>
          <span className="text-lg md:text-xl font-black text-slate-900 tracking-tighter">Luís <span className="text-indigo-600">Imóveis</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
           <button onClick={() => { setDealType('SALE'); scrollToSection('hero'); }} className={`text-xs font-black uppercase tracking-widest transition-colors ${dealType === 'SALE' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Venda</button>
           <button onClick={() => { setDealType('RENT'); scrollToSection('hero'); }} className={`text-xs font-black uppercase tracking-widest transition-colors ${dealType === 'RENT' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Locação</button>
           <button onClick={() => scrollToSection('destaques')} className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">Imóveis</button>
           <button 
             onClick={() => navigate('/dashboard')}
             className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg"
           >
             Área Restrita
           </button>
        </div>

        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg">
          <Menu size={24} />
        </button>
      </nav>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] bg-white animate-in slide-in-from-right duration-300 flex flex-col p-6">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-black text-slate-900">Navegação</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={24}/></button>
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={() => { setDealType('SALE'); setMobileMenuOpen(false); }} className="py-4 px-6 bg-slate-50 rounded-2xl text-left font-black uppercase text-sm tracking-widest">Comprar</button>
            <button onClick={() => { setDealType('RENT'); setMobileMenuOpen(false); }} className="py-4 px-6 bg-slate-50 rounded-2xl text-left font-black uppercase text-sm tracking-widest">Alugar</button>
            <button onClick={() => { scrollToSection('destaques'); setMobileMenuOpen(false); }} className="py-4 px-6 bg-slate-50 rounded-2xl text-left font-black uppercase text-sm tracking-widest">Destaques</button>
            <button onClick={() => navigate('/dashboard')} className="py-4 px-6 bg-indigo-600 text-white rounded-2xl text-left font-black uppercase text-sm tracking-widest">Entrar no ERP</button>
          </div>
        </div>
      )}

      {/* Hero & Search Engine */}
      <section id="hero" className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
            Sua nova história começa em <span className="text-indigo-600">Guaranésia</span>
          </h1>
          <p className="text-slate-500 font-medium md:text-xl max-w-2xl mx-auto">
            Explore os melhores imóveis da região com tecnologia e transparência.
          </p>
        </div>

        {/* Engine de Busca Aprimorada */}
        <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-900/10 border border-slate-100 relative z-10">
          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-6">
            <button 
              type="button"
              onClick={() => setDealType('SALE')}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${dealType === 'SALE' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              Comprar
            </button>
            <button 
              type="button"
              onClick={() => setDealType('RENT')}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${dealType === 'RENT' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              Alugar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <MapPin size={12} className="text-indigo-600"/> Localização
              </label>
              <input 
                type="text" 
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Ex: Vila Betel ou Centro" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <Layers size={12} className="text-indigo-600"/> Tipo de Imóvel
              </label>
              <select 
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="ALL">Qualquer Tipo</option>
                <option value="RESIDENTIAL">Residencial</option>
                <option value="COMMERCIAL">Comercial</option>
                <option value="LAND">Terreno / Lote</option>
              </select>
            </div>

            <div className="md:col-span-3 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Bed size={12} className="text-indigo-600"/> Quartos
                </label>
                <select 
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                >
                  <option value="any">Todos</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Car size={12} className="text-indigo-600"/> Vagas
                </label>
                <select 
                  value={parking}
                  onChange={(e) => setParking(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                >
                  <option value="any">Todos</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <button 
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados da Busca */}
      <section id="destaques" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Curadoria Especial
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
              {filteredResults.length > 0 ? 'Encontramos para você' : 'Sem resultados'}
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              {filteredResults.length > 0 
                ? `Mostrando ${filteredResults.length} imóveis disponíveis em Guaranésia e região.` 
                : 'Ajuste seus filtros e tente novamente.'}
            </p>
          </div>
          {filteredResults.length !== PORTAL_PROPERTIES.length && (
            <button 
              type="button"
              onClick={clearFilters}
              className="px-6 py-3 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} /> Limpar Filtros
            </button>
          )}
        </div>

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredResults.map((prop) => (
              <div 
                key={prop.id} 
                onClick={() => setSelectedProperty(prop)}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-500 cursor-pointer flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={prop.img} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-lg">
                    {prop.tag}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedProperty(prop); }}
                      className="w-full py-3 bg-white text-slate-900 font-black rounded-xl text-[10px] uppercase tracking-widest active:scale-95 transition-transform translate-y-2 group-hover:translate-y-0 duration-500"
                    >
                      Ver Ficha Completa
                    </button>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">{prop.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={12} className="text-indigo-500" /> {prop.loc}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 rounded-2xl mb-6 shadow-inner border border-slate-100">
                    <div className="flex flex-col items-center gap-1">
                      <Bed size={16} className="text-indigo-500" />
                      <span className="text-[10px] font-black text-slate-700">{prop.beds > 0 ? prop.beds : '-'} Qts</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-slate-200">
                      <Car size={16} className="text-indigo-500" />
                      <span className="text-[10px] font-black text-slate-700">{prop.parking > 0 ? prop.parking : '-'} Vag</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Maximize size={16} className="text-indigo-500" />
                      <span className="text-[10px] font-black text-slate-700">{prop.area}m²</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900 tracking-tighter">{prop.price}</span>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="p-10 bg-slate-50 rounded-full text-slate-200 mb-8">
              <SearchX size={80} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Ops! Nenhum imóvel encontrado</h3>
            <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto">Tente remover alguns filtros ou buscar em outro bairro de Guaranésia.</p>
            <button 
              type="button"
              onClick={clearFilters}
              className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95"
            >
              Ver todos os imóveis
            </button>
          </div>
        )}
      </section>

      {/* Footer Simples */}
      <footer className="bg-slate-900 py-24 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Home size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter">Luís <span className="text-indigo-400">Imóveis</span></span>
            </div>
            <p className="text-slate-400 font-medium max-w-sm">Tecnologia e confiança na palma da sua mão. Líder em negociações imobiliárias em Guaranésia - MG.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Atendimento</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li className="flex items-center gap-3"><Phone size={18} className="text-indigo-500"/> (35) 99999-0000</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-indigo-500"/> contato@luisimoveis.com.br</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Modal de Detalhes do Imóvel */}
      {selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:zoom-in-95 duration-300 flex flex-col md:flex-row">
            <div className="md:w-3/5 h-[40vh] md:h-auto relative shrink-0">
              <img src={selectedProperty.img} className="w-full h-full object-cover" alt={selectedProperty.title} />
              <button onClick={() => setSelectedProperty(null)} className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full text-slate-900 md:hidden"><X size={24}/></button>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Ref: {selectedProperty.id}00{selectedProperty.id}</span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedProperty.title}</h3>
                </div>
                <button onClick={() => setSelectedProperty(null)} className="p-3 hover:bg-slate-50 rounded-2xl hidden md:block text-slate-300 hover:text-slate-900 transition-all"><X size={32}/></button>
              </div>

              <div className="space-y-8 flex-1">
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
                  <MapPin size={18} className="text-indigo-500" /> {selectedProperty.loc}
                </div>

                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                  <div className="flex flex-col items-center gap-2">
                    <Bed className="text-indigo-500" size={24} />
                    <span className="text-xs font-black text-slate-900">{selectedProperty.beds} Quartos</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 border-x border-slate-200">
                    <Car className="text-indigo-500" size={24} />
                    <span className="text-xs font-black text-slate-900">{selectedProperty.parking} Vagas</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Maximize className="text-indigo-500" size={24} />
                    <span className="text-xs font-black text-slate-900">{selectedProperty.area}m² Área</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Descrição Detalhada</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">{selectedProperty.description}</p>
                </div>

                <div className="pt-8 border-t border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Preço de {selectedProperty.tag}</p>
                   <p className="text-4xl font-black text-indigo-600 tracking-tighter">{selectedProperty.price}</p>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => handleWhatsAppContact(`Olá! Vi o imóvel "${selectedProperty.title}" no portal e gostaria de visitá-lo.`)}
                  className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95 text-xs uppercase tracking-widest"
                >
                  <MessageCircle size={20} /> Agendar Visita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
