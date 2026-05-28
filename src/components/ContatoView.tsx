import React from 'react';
import { Mail, Phone, MapPin, Search, Filter, MessageSquare, Check, Landmark } from 'lucide-react';

interface ContatoViewProps {
  siteSettings?: Record<string, string>;
}

export default function ContatoView({ siteSettings }: ContatoViewProps) {
  const [sectorFilter, setSectorFilter] = React.useState('Todos');
  const [stateFilter, setStateFilter] = React.useState('Todos');
  
  // Form state
  const [contName, setContName] = React.useState('');
  const [contEmail, setContEmail] = React.useState('');
  const [contPhone, setContPhone] = React.useState('');
  const [contSubject, setContSubject] = React.useState('venda_laranjas');
  const [contMsg, setContMsg] = React.useState('');
  const [formSent, setFormSent] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  const farms = [
    { name: 'Granja Nova', sector: 'Venda de Ovos', city: 'Tatuí - SP', phone: '(15) 3259-9710' },
    { name: 'Nova Aliança (Sede)', sector: 'Venda de Laranjas', city: 'Tatuí - SP', phone: '(15) 3259-9710' },
    { name: 'Fortaleza', sector: 'Venda de Laranjas', city: 'Tatuí - SP', phone: '(15) 3259-9725' },
    { name: 'Califórnia', sector: 'Venda de Laranjas', city: 'Burí - SP', phone: '(15) 99853-7212' },
    { name: 'Santa Fé', sector: 'Venda de Laranja', city: 'Burí - SP', phone: '(15) 99850-3994' },
    { name: 'Nova Esperança', sector: 'Venda de Café', city: 'Itaí - SP', phone: '(14) 99880-1801' },
    { name: 'Bela Vista', sector: 'Venda de Café', city: 'Itaí - SP', phone: '(14) 99880-1801' },
    { name: 'Vitória São Lourenço', sector: 'Venda de Gado', city: 'Santo Antônio do Leverger - MT', phone: '(15) 3259-9710' },
    { name: 'Estrela do Oeste', sector: 'Venda de Gado', city: 'Santo Antônio do Leverger - MT', phone: '(15) 3259-9710' },
    { name: 'Boa Esperança', sector: 'Venda de Gado', city: 'Santo Antônio do Leverger - MT', phone: '(15) 3259-9710' },
    { name: 'Vale do Mutum', sector: 'Venda de Gado', city: 'Santo Antônio do Leverger - MT', phone: '(15) 3259-9710' }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contName || !contEmail || !contMsg) {
      setFormError('Por favor, preencha nome, e-mail e mensagem.');
      return;
    }
    setFormError('');
    // Simulate email dispatch
    setFormSent(true);
    // Clear
    setContName('');
    setContEmail('');
    setContPhone('');
    setContMsg('');
  };

  const filteredFarms = farms.filter((farm) => {
    const sMatch = sectorFilter === 'Todos' || farm.sector.toLowerCase().includes(sectorFilter.toLowerCase());
    const stateVal = farm.city.split('-')[1]?.trim() || '';
    const stMatch = stateFilter === 'Todos' || stateVal === stateFilter;
    return sMatch && stMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-xs font-bold text-amber-600 tracking-widest uppercase font-mono">Fale Conosco</h2>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Nossos Contatos e Unidades De Produção
        </h1>
        <p className="text-slate-500 text-sm mt-2">Deseja adquirir nossos produtos no atacado ou agendar carregamentos? Utilize nossos telefones diretos.</p>
        <div className="w-20 h-1.5 bg-emerald-800 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact list & Filters column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl p-4 sm:p-6 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 flex items-center">
                <Landmark className="w-5 h-5 mr-2 text-emerald-800" />
                Telefones das Unidades
              </h3>
              
              {/* Dynamic Filters */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 text-xs w-full sm:w-auto">
                <select 
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full sm:w-auto bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-2 sm:py-1.5 focus:outline-emerald-800 font-semibold text-slate-700 text-[11px] sm:text-xs text-ellipsis overflow-hidden"
                >
                  <option value="Todos">Todos os Setores</option>
                  <option value="Ovos">Avicultura (Ovos)</option>
                  <option value="Laranja">Citricultura (Laranjas)</option>
                  <option value="Café">Cafeicultura (Café)</option>
                  <option value="Gado">Agropecuária (Gado)</option>
                </select>

                <select 
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full sm:w-auto bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-2 sm:py-1.5 focus:outline-emerald-800 font-semibold text-slate-700 text-[11px] sm:text-xs text-ellipsis overflow-hidden"
                >
                  <option value="Todos">Todos Estados</option>
                  <option value="SP">São Paulo (SP)</option>
                  <option value="MT">Mato Grosso (MT)</option>
                </select>
              </div>
            </div>

            {/* Farms Grid Table */}
            <div className="divide-y divide-slate-100 overflow-hidden rounded-xl">
              {filteredFarms.length > 0 ? (
                filteredFarms.map((farm, idx) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm hover:bg-slate-50 px-3 rounded-lg transition-colors">
                    <div>
                      <h4 className="font-extrabold text-slate-900">{farm.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{farm.sector}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 sm:gap-x-6">
                      <span className="inline-flex items-center text-xs font-semibold text-slate-600 font-mono whitespace-nowrap shrink-0">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-red-500 shrink-0" />
                        {farm.city}
                      </span>
                      <a 
                        href={`tel:${farm.phone.replace(/[^0-9]/g, '')}`}
                        className="inline-flex items-center space-x-1.5 text-emerald-800 hover:text-emerald-950 font-bold font-mono text-sm whitespace-nowrap shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{farm.phone}</span>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 italic text-xs">
                  Nenhuma unidade correspondente aos filtros.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-5">
          <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-emerald-800 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {formSent ? (
              <div className="space-y-4 text-center py-10 animate-fade-in relative z-10">
                <div className="w-12 h-12 bg-emerald-800 border border-emerald-600 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase font-sans">Sua Mensagem foi Enviada!</h3>
                <p className="text-xs text-emerald-200 leading-relaxed max-w-sm mx-auto font-sans">
                  Agradecemos o contato. Encaminhamos os detalhes de sua solicitação à gerência de vendas da Fazenda Nova Aliança (Tatuí-SP). Breve daremos retorno.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold text-xs px-6 py-2.5 rounded-xl border border-amber-400 transition-colors"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase font-mono bg-emerald-850 px-2.5 py-1 rounded border border-emerald-800">
                    Atendimento Online
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white mt-2">Formulário de Pedido ou Dúvida</h3>
                  <p className="text-xs text-emerald-200">Envie uma mensagem e nossa equipe comercial entrará em contato.</p>
                </div>

                {formError && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3.5 rounded-2xl text-xs font-semibold animate-fade-in flex items-center space-x-2">
                    <span className="text-amber-400">⚠️</span>
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-emerald-250 uppercase mb-1">Seu Nome / Razão Social *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Supermercado Aliança Ltda"
                    value={contName}
                    onChange={(e) => setContName(e.target.value)}
                    className="w-full bg-emerald-950/50 border border-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-amber-500 text-white placeholder-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-250 uppercase mb-1">E-mail para Retorno *</label>
                    <input
                      type="email"
                      required
                      placeholder="comercial@compras.com"
                      value={contEmail}
                      onChange={(e) => setContEmail(e.target.value)}
                      className="w-full bg-emerald-950/50 border border-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-amber-500 text-white placeholder-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-250 uppercase mb-1">Telefone WhatsApp</label>
                    <input
                      type="text"
                      placeholder="Ex: (11) 98877-6655"
                      value={contPhone}
                      onChange={(e) => setContPhone(e.target.value)}
                      className="w-full bg-emerald-950/50 border border-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-amber-500 text-white placeholder-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-emerald-250 uppercase mb-1">Segmento de Interesse *</label>
                  <select
                    value={contSubject}
                    onChange={(e) => setContSubject(e.target.value)}
                    className="w-full bg-emerald-950 border border-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-amber-500 text-white font-sans"
                  >
                    <option value="venda_laranjas">🍊 Compra de Laranjas e Citros</option>
                    <option value="venda_ovos">🥚 Distribuição de Ovos Postura</option>
                    <option value="venda_cafe">☕ Aquisição de Grãos de Café Arábica</option>
                    <option value="venda_gado">🐂 Aquisição / Venda de Gado Nelore</option>
                    <option value="outros">❓ Outros Assuntos Corporativos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-emerald-250 uppercase mb-1">Descrição do Pedido / Dúvida *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ex: Gostaria de solicitar cotação de 500 caixas de Laranja Ponkan entregues em São Paulo-SP..."
                    value={contMsg}
                    onChange={(e) => setContMsg(e.target.value)}
                    className="w-full bg-emerald-950/50 border border-emerald-800 px-4 py-2.5 rounded-xl text-xs text-white placeholder-emerald-400 font-sans"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black text-xs py-3 rounded-xl shadow-md transition-all uppercase tracking-wider border border-amber-400 cursor-pointer"
                >
                  Enviar Mensagem Comercial
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* Endereço Principal & Mapa */}
      <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
        <div className="p-8 lg:p-12 lg:col-span-5 flex flex-col justify-between space-y-8 bg-slate-50/50">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 tracking-widest uppercase font-mono bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
              Sede Administrativa
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4 tracking-tight">Fazenda Shigueno</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Venha nos visitar ou faça uma retirada agendada de cargas de Citros e Ovos diretamente em nossa sede. Estacionamento gratuito e guias comerciais no local.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Endereço</p>
                <p className="text-slate-600 text-xs mt-1 font-medium leading-relaxed">
                  Fazenda Shigueno<br />
                  Rodovia Gladys Bernardes Minhoto, km 38 (SP-129)<br />
                  Vale dos Lagos — Tatuí - SP<br />
                  CEP 18277-680
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-sm">
              <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Atendimento Telefônico</p>
                <p className="text-slate-600 text-xs mt-1 font-semibold font-mono">
                  {siteSettings?.contact_phone || '(15) 3259-9710'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-sm">
              <Mail className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">E-mail de Contato</p>
                <p className="text-slate-600 text-xs mt-1 font-semibold font-mono">
                  {siteSettings?.contact_email || 'sac@shigueno.com.br'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-200/60">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Granja+Shigueno+Tatu%C3%AD+-+SP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              <span>Abrir no Google Maps</span>
              <span className="ml-1 text-xs">→</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 min-h-[350px] lg:min-h-[480px] w-full relative bg-slate-100">
          <iframe
            id="gmap_canvas"
            src="https://maps.google.com/maps?q=Granja%20Shigueno,%20Tatu%C3%AD%20-%20SP&t=&z=14&ie=UTF8&iwloc=&output=embed"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            className="absolute inset-0 w-full h-full border-0"
            title="Localização da Fazenda Shigueno no Google Maps"
            allowFullScreen
          ></iframe>
        </div>
      </div>

    </div>
  );
}
