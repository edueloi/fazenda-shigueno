import React from 'react';
import { Calendar, CircleDot, Egg, Coffee, Award, Search, HelpCircle, MapPin, Anchor } from 'lucide-react';

interface ProdutosViewProps {
  activeTab?: 'avicultura' | 'citricultura' | 'cafeicultura' | 'agropecuaria';
  onTabChange?: (tab: 'avicultura' | 'citricultura' | 'cafeicultura' | 'agropecuaria') => void;
  siteSettings?: Record<string, string>;
}

export default function ProdutosView({ activeTab: propActiveTab, onTabChange, siteSettings }: ProdutosViewProps = {}) {
  const [localTab, setLocalTab] = React.useState<'avicultura' | 'citricultura' | 'cafeicultura' | 'agropecuaria'>('avicultura');

  const activeTab = propActiveTab || localTab;
  const setActiveTab = (tab: 'avicultura' | 'citricultura' | 'cafeicultura' | 'agropecuaria') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalTab(tab);
    }
  };

  const [citrusSearch, setCitrusSearch] = React.useState('');

  const eggTypes = [
    { code: 'SE', name: 'Tipo Super Extra (Jumbo)', desc: 'O maior calibre produzido em nossos galpões de postura. Seleção premium para receitas que demandam alto rendimento de gema.', weight: 'Média de +66g por unidade', shell: 'Casca super espessa, branca ou vermelha.' },
    { code: 'E', name: 'Tipo Extra', desc: 'Classificação excelente para revenda final e mercados gourmet. Embalados sob rigoroso controle de estanque.', weight: 'Média de 60g a 65g por unidade', shell: 'Casca uniforme e textura lisa.' },
    { code: 'A', name: 'Tipo Grande', desc: 'O campeão de vendas nas gôndolas de todo o Brasil. Inteiramente higienizado e inspecionado eletronicamente.', weight: 'Média de 55g a 59g por unidade', shell: 'Casca extremamente firme.' },
    { code: 'B', name: 'Tipo Médio', desc: 'Excelente custo-benefício para panificadoras e confeitarias regulares que exigem padrão constante.', weight: 'Média de 50g a 54g por unidade', shell: 'Visual intacto.' },
    { code: 'C', name: 'Tipo Pequeno', desc: 'Ovários jovens, ideais para consumo rápido domesticamente ou conservas específicas.', weight: 'Média de 45g a 49g por unidade', shell: 'Alta densidade de clara.' },
    { code: 'D', name: 'Tipo Industrial', desc: 'Exclusivo para processamento fabril e pasteurização líquida/desidratada por indústrias alimentícias.', weight: 'Abaixo de 45g por unidade', shell: 'Destinados à quebra mecanizada industrial.' }
  ];

  const citrusVarieties = [
    { name: 'Tangerina Ponkan', months: 'Abril a Julho', type: 'Mesa', desc: 'Sabor altamente doce, fácil de descascar e com gomos repletos de caldo.' },
    { name: 'Laranja Folha Murcha', months: 'Fevereiro a Março', type: 'Mesa / Suco', desc: 'Excelente rendimento de suco ácido e adocicado na medida perfeita.' },
    { name: 'Laranja Lima Rafael', months: 'Abril a Julho', type: 'Baixa acidez (Lima)', desc: 'Ideal para crianças e pessoas com sensibilidade estomacal devido à acidez quase zero.' },
    { name: 'Laranja Bahia', months: 'Abril a Julho', type: 'Mesa', desc: 'Muito saborosa, conhecida pelo "umbigo" na extremidade, fácil de degustar e sem sementes.' },
    { name: 'Tangerina Murcote', months: 'Agosto a Dezembro', type: 'Mesa / Suco', desc: 'Híbrido vigoroso, casca firme e brilhante, excelente conservação pós-colheita.' },
    { name: 'Laranja Rubi', months: 'Junho a Julho', type: 'Suco', desc: 'Suco com coloração tipicamente avermelhada/alaranjada intensa e alto teor de frutose.' },
    { name: 'Laranja Lima Verde', months: 'Agosto a Novembro', type: 'Baixa acidez', desc: 'Muito refrescante, cultivada com fertilizantes de esterco para acentuar a doçura natural.' },
    { name: 'Laranja Hamilim', months: 'Maio a Junho', type: 'Precoce / Suco', desc: 'Fruta precoce de casca fina, muito rendimento de líquido límpido.' },
    { name: 'Laranja Pêra Coroa', months: 'Setembro a Novembro', type: 'Mesa / Industrial', desc: 'Espécie tradicional de grande aceitação, tamanho ideal para ensacamento comercial.' },
    { name: 'Laranja Charmute', months: 'Janeiro a Fevereiro', type: 'Suco', desc: 'Colheita focada no início do ano para abastecer distribuidoras durante a entressafra geral.' },
    { name: 'Laranja Valência', months: 'Novembro a Dezembro', type: 'Industrial / Suco', desc: 'A variedade mais plantada para exportação devido à estabilidade térmica do suco concentrado.' },
    { name: 'Laranja Westin', months: 'Junho a Julho', type: 'Precoce', desc: 'Polpa macia de maturação adiantada, excelente para consumo in natura imediato.' },
    { name: 'Laranja Pêra Natal', months: 'Janeiro a Março', type: 'Tardia / Suco', desc: 'Excelente resistência no pé durante as semanas quentes de verão.' }
  ];

  const filteredCitrus = citrusVarieties.filter(v =>
    v.name.toLowerCase().includes(citrusSearch.toLowerCase()) ||
    v.months.toLowerCase().includes(citrusSearch.toLowerCase())
  );

  const coffeeVarieties = [
    { name: 'Mundo Novo', desc: 'Resultante da hibridização natural, muito vigorosa com alta acidez equilibrada e notas achocolatadas.' },
    { name: 'Catuaí', desc: 'Porte baixo de fácil manejo que retém o fruto por mais tempo, gerando doçura intensa e corpo cremoso.' },
    { name: 'Tupi', desc: 'Altíssima resistência a pragas, bebida limpa, acidez cítrica moderada e aroma floral persistente.' },
    { name: 'Ouro Verde', desc: 'Bebida extremamente encorpada com notas sutis de avelã, ideal para apreciadores de espressos clássicos.' },
    { name: 'Topázio', desc: 'Sabor de caramelo marcante, acidez equilibrada e doçura pronunciada de processamento natural.' },
    { name: 'Catucaí', desc: 'Crossover com excelente resistência a geadas, aroma caramelizado e finalização limpa e refrescante.' }
  ];

  const MTFazendas = [
    { name: 'Fazenda Vitória São Lourenço', role: 'Cria e Recria de Bezerros Nelore', city: 'Santo Antônio do Leverger - MT', phone: '(15) 3259-9710' },
    { name: 'Fazenda Estrela do Oeste', role: 'Engorda e Alimentação Controlada', city: 'Santo Antônio do Leverger - MT', phone: '(15) 3259-9710' },
    { name: 'Fazenda Boa Esperança', role: 'Melhoramento Genético de Touros', city: 'Santo Antônio do Leverger - MT', phone: '(15) 3259-9710' },
    { name: 'Fazenda Vale do Mutum', role: 'Pastagens de Lactação e Recria', city: 'Santo Antônio do Leverger - MT', phone: '(15) 3259-9710' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-xs font-bold text-amber-600 tracking-widest uppercase font-mono">Nosso Catálogo</h2>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Excelência em Cada Segmento do Campo
        </h1>
        <p className="text-slate-500 text-sm mt-2">Nossas frentes produtivas operam integrando ecossistema autossustentável e rígidos controles fitossanitários.</p>
        <div className="w-20 h-1.5 bg-emerald-800 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-slate-150 pb-4">
        {[
          { key: 'avicultura', label: '🥚 Avicultura de Postura', bg: 'hover:text-amber-700 hover:bg-amber-50', activeBg: 'bg-amber-500 text-white border-amber-500 shadow-md' },
          { key: 'citricultura', label: '🍊 Citricultura Técnica', bg: 'hover:text-emerald-700 hover:bg-emerald-50', activeBg: 'bg-emerald-750 text-white border-emerald-700 shadow-md' },
          { key: 'cafeicultura', label: '☕ Cafeicultura Nobre', bg: 'hover:text-[#8B5A2B] hover:bg-amber-100/40', activeBg: 'bg-[#8B5A2B] text-white border-[#704214] shadow-md' },
          { key: 'agropecuaria', label: '🐂 Nelore Agropecuária', bg: 'hover:text-emerald-900 hover:bg-slate-100', activeBg: 'bg-emerald-950 text-white border-emerald-950 shadow-md' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-5 py-3 rounded-xl border border-slate-200 text-sm font-bold transition-all cursor-pointer ${
              activeTab === tab.key ? tab.activeBg : `bg-white text-slate-700 ${tab.bg}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rendered active tab panel */}
      <div className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-10 shadow-xs">
        
        {/* TAB 1: AVICULTURA */}
        {activeTab === 'avicultura' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-150 pb-8">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold bg-amber-105 text-amber-900 border border-amber-200 px-3 py-1 rounded-md uppercase font-mono">
                  Fazenda Nova Aliança - Tatuí (SP)
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Classificação e Nutrição Sob Medida
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {siteSettings?.prod_avicultura_desc || 'Na Fazenda Nova Aliança, o cuidado começa na linhagem das poedeiras e se estende até as modernas esteiras de pesagem eletrônica automatizada. Produzimos 06 tipos comerciais de ovos, acondicionados delicadamente para transporte rápido com máxima proteção e frescor incomparável.'}
                </p>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed">
                  💡 <strong>Compromisso de Frescor:</strong> Graças à logística integrada com as nossas frotas, as entregas são feitas no mesmo dia da coleta para os principais centros de abastecimento paulistas.
                </div>
              </div>
              <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-amber-100/40 p-6 rounded-2xl border border-amber-100 flex flex-col items-center justify-center text-center space-y-3">
                <Egg className="w-16 h-16 text-amber-500 animate-pulse" />
                <h4 className="font-extrabold text-slate-900">Capacidade Operacional de Classificação</h4>
                <p className="text-xs text-slate-600">
                  Linhas de empacotamento com inspeção por ovoscopia, banho desinfetante ultrassônico e divisão volumétrica exata de calibres regulados.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-950 flex items-center">
                <CircleDot className="w-4 h-4 mr-2 text-amber-500" />
                Nossa Classificação de Ovos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eggTypes.map((egg, i) => (
                  <div key={i} className="border border-slate-150 rounded-xl p-5 hover:border-amber-400 hover:shadow-xs transition-colors bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black bg-amber-500 text-white px-2.5 py-1 rounded-md font-mono">{egg.code}</span>
                      <span className="text-[11px] text-emerald-800 font-mono font-bold uppercase">{egg.weight}</span>
                    </div>
                    <h5 className="font-extrabold text-slate-900 text-sm">{egg.name}</h5>
                    <p className="text-xs text-slate-650 leading-relaxed mt-2">{egg.desc}</p>
                    <p className="text-[10px] text-slate-450 italic mt-2.5">Física: {egg.shell}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CITRICULTURA */}
        {activeTab === 'citricultura' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-slate-150 pb-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-250 px-3 py-1 rounded-md uppercase font-mono">
                  Sinergia de Solo: Tatuí SP & Burí SP
                </span>
                <h3 className="text-2xl font-black text-emerald-950">
                  Adubação Orgânica Aviária para Laranjas No Coração de SP
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {siteSettings?.prod_citricultura_desc || 'A Fazenda Nova Aliança (Tatuí-SP) e a Fazenda Califórnia (Burí-SP) produzem laranjas doces excepcionais para suco e mesa. Usamos o adubo orgânico das próprias galinhas para fertilizar os pomares, conferindo um sabor indescritivelmente doce, baixa acidez de polpa e sustentabilidade exemplar ao ecossistema.'}
                </p>
                <p className="text-xs text-slate-500">
                  ✓ <strong>Estimativa de Campo:</strong> Nossos técnicos realizam exames de reteramento de frutos e análises climáticas sazonais de campo para obter a produtividade e datas exatas de doçura máxima antes da colheita seletiva manual.
                </p>
              </div>
              <div className="lg:col-span-4 bg-emerald-50 px-6 py-8 rounded-2xl border border-emerald-200">
                <h4 className="text-sm font-extrabold text-emerald-900 flex items-center mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Pomares Sazonais
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Nosso calendário de colheita cobre praticamente os 12 meses do ano através da rotação de 13 variedades específicas de laranjas e tangerinas de mesa ou suco.
                </p>
              </div>
            </div>

            {/* Calendar Table Search */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h4 className="text-lg font-bold text-slate-950">Calendário de Safra (13 Variedades)</h4>
                <div className="relative max-w-xs">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Filtrar variedade ou mês..."
                    value={citrusSearch}
                    onChange={(e) => setCitrusSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs w-full focus:outline-emerald-800"
                  />
                </div>
              </div>

              {/* Responsive Citrus Varieties View */}
              <div className="hidden md:block overflow-x-auto border border-slate-150 rounded-2xl shadow-xs">
                <table className="min-w-full divide-y divide-slate-150 text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase">
                    <tr>
                      <th className="px-6 py-4">Variedade Cítrica</th>
                      <th className="px-6 py-4">Período de Colheita</th>
                      <th className="px-6 py-4">Uso Principal</th>
                      <th className="px-6 py-4">Características de Sabor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-sans text-slate-700">
                    {filteredCitrus.length > 0 ? (
                      filteredCitrus.map((v, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3.5 font-bold text-slate-900">{v.name}</td>
                          <td className="px-6 py-3.5">
                            <span className="inline-block px-3 py-1 bg-amber-50 rounded-full text-amber-850 font-bold text-xs border border-amber-200">
                              {v.months}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-xs font-semibold text-emerald-800">{v.type}</td>
                          <td className="px-6 py-3.5 text-xs text-slate-650">{v.desc}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-xs italic">
                          Nenhuma variedade encontrada para "{citrusSearch}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Mobile Friendly List (Hidden on desktop) */}
              <div className="block md:hidden space-y-4">
                {filteredCitrus.length > 0 ? (
                  filteredCitrus.map((v, i) => (
                    <div key={i} className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-2.5">
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="font-extrabold text-slate-900 text-sm leading-tight">{v.name}</h5>
                        <span className="shrink-0 inline-block px-2.5 py-0.5 bg-amber-50 rounded-full text-amber-850 font-bold text-[10px] border border-amber-200">
                          {v.months}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="font-bold text-emerald-850 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide text-[9px]">
                          Tipo: {v.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-650 leading-relaxed">{v.desc}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 text-xs italic py-6">
                    Nenhuma variedade encontrada para "{citrusSearch}".
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAFEICULTURA */}
        {activeTab === 'cafeicultura' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-150 pb-8">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold bg-[#8B5A2B]/10 text-[#8B5A2B] border border-[#8B5A2B]/30 px-3 py-1 rounded-md uppercase font-mono">
                  Itaí - São Paulo
                </span>
                <h3 className="text-2xl font-black text-[#5C3A1A]">
                  Café Arábica de Altitude Invejável
                </h3>
                <p className="text-slate-650 text-sm leading-relaxed">
                  {siteSettings?.prod_cafeicultura_desc || 'Operamos em Itaí (SP) com as conceituadas fazendas Nova Esperança, Novo Horizonte e Bela Vista. Aliando solos profundos e microclima serrano ideal, colhemos grãos 100% Arábica de maturação lenta com propriedades organolépticas excepcionais, conferindo notas persistentes à bebida final.'}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-mono text-xs font-bold rounded">Fazenda Nova Esperança</span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-mono text-xs font-bold rounded">Fazenda Novo Horizonte</span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-mono text-xs font-bold rounded">Fazenda Bela Vista</span>
                </div>
              </div>
              <div className="lg:col-span-4 bg-amber-100/30 p-6 rounded-2xl border border-amber-200 text-center flex flex-col items-center">
                <Coffee className="w-12 h-12 text-[#8B5A2B] mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Grãos Selecionados de Altitude</h4>
                <p className="text-[11px] text-slate-600 mt-1">Colheita rigorosa focada no zênite de maturação da cereja, seguido de terreiro suspenso ecológico.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center">
                <Award className="w-4 h-4 mr-2 text-amber-600" />
                Nossas Variedades de Café Arábica
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coffeeVarieties.map((item, i) => (
                  <div key={i} className="border border-slate-150 bg-slate-50/50 p-5 rounded-2xl relative overflow-hidden group hover:border-[#8B5A2B] transition-colors">
                    <h5 className="font-extrabold text-slate-900 text-base">{item.name}</h5>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{item.desc}</p>
                    <span className="absolute bottom-1 right-2 text-3xl font-bold text-amber-100/40 select-none font-mono">0{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AGROPECUARIA */}
        {activeTab === 'agropecuaria' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-150 pb-8">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold bg-emerald-950 text-emerald-100 px-3 py-1 rounded-md uppercase font-mono">
                  Santo Antônio do Leverger - MT
                </span>
                <h3 className="text-2xl font-black text-slate-950">
                  Cria e Recria de Nelore com Máxima Dignidade
                </h3>
                <p className="text-slate-650 text-sm leading-relaxed font-sans">
                  {siteSettings?.prod_nelore_desc || 'No estado de Mato Grosso, mantemos a tradição pecuária nos limites de Santo Antônio do Leverger. Nosso rebanho da raça Nelore é acompanhado por corpo veterinário contínuo, focado em manejo gentil racional, suplementação mineral em pasto rotacionado e rigoroso calendário de imunização contra epizootias.'}
                </p>
                <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-100 text-xs">
                  🤝 <strong>Fornecedores Locais MT:</strong> Gerenciamos uma ampla rede de parceiros de recria no Mato Grosso, impulsionando a economia da microrregião pantaneira e garantindo origens idôneas do berço de bezerros Nelore.
                </div>
              </div>
              <div className="lg:col-span-4 bg-neutral-100/60 p-6 rounded-2xl border border-neutral-250 flex flex-col items-center text-center">
                <MapPin className="w-8 h-8 text-emerald-800 mb-1" />
                <h4 className="text-sm font-bold text-slate-900">4 Fazendas em Leverger - MT</h4>
                <p className="text-xs text-slate-500 mt-1">Confinamentos e pastagens unificadas para cria equilibrada e gado ecologicamente monitorado.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900">Nossas Unidades de Produção no Mato Grosso:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MTFazendas.map((faz, idx) => (
                  <div key={idx} className="border border-slate-150 rounded-2xl p-5 bg-[#fafbfa] flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-900 text-sm">{faz.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{faz.role}</p>
                      <p className="text-xs text-emerald-800 font-semibold">{faz.city}</p>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-white px-2.5 py-1 rounded-lg shadow-xs border text-slate-600 block shrink-0">{faz.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
