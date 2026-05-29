import React from 'react';
import { ArrowLeftRight, ChevronRight, Droplet, Egg, Leaf, Shield, Sparkles, Sprout, TrendingUp, Users } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string, tab?: string) => void;
  siteSettings?: Record<string, string>;
}

export default function HomeView({ onNavigate, siteSettings }: HomeViewProps) {
  // Use DB site settings if provided, otherwise default to the standard copy
  const motto = siteSettings?.company_motto || "Uma empresa sempre preocupada com a qualidade de vida.";
  const intro = siteSettings?.about_text_intro || "O patriarca da família Shigueno, Sr. Haruo Shigueno chegou ao Brasil em 1932. Na bagagem apenas vontade e determinação.";

  const pillars = [
    {
      title: 'Avicultura de Postura',
      description: 'Produção diária de 6 tamanhos seletivos de ovos na Fazenda Nova Aliança, com rigorosos padrões de higiene e classificação eletrônica qualificada.',
      icon: Egg,
      badge: 'Super Extra a Industrial',
      bgColor: 'bg-amber-50/70',
      iconColor: 'text-amber-650',
      borderColor: 'border-amber-200',
      tab: 'avicultura',
      image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Citricultura Orgânica',
      description: 'Pioneirismo na fertilização orgânica do solo através de esterco aviário desde 1975. Produção de laranjas de mesa doces e tangerinas nobres colhidas o ano todo.',
      icon: Sprout,
      badge: '13 Variedades Calendário',
      bgColor: 'bg-emerald-50/70',
      iconColor: 'text-emerald-700',
      borderColor: 'border-emerald-250',
      tab: 'citricultura',
      image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Cafeicultura de Altitude',
      description: 'Cultivo especializado de Café Arábica no município de Itaí - SP (Fazendas Nova Esperança, Novo Horizonte e Bela Vista) com as mais renomadas linhagens.',
      icon: Leaf,
      badge: 'Café Arábica Seletivo',
      bgColor: 'bg-amber-100/30',
      iconColor: 'text-[#8B5A2B]',
      borderColor: 'border-amber-300',
      tab: 'cafeicultura',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Pecuária de Corte (Nelore)',
      description: 'Cria e recria sob supervisão técnica especializada de rebanho bovino da raça Nelore em Santo Antônio do Leverger - MT, assegurando máxima dignidade e bem-estar animal.',
      icon: TrendingUp,
      badge: 'Nelore Premium MT',
      bgColor: 'bg-[#fafcfa]',
      iconColor: 'text-emerald-950',
      borderColor: 'border-emerald-200',
      tab: 'agropecuaria',
      image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      
      {/* Banner / Hero Section with Green & Amber Atmosphere and real agricultural panoramic view */}
      <section 
        className="relative overflow-hidden bg-cover bg-center text-white py-24 px-4 sm:px-6 lg:px-8 shadow-inner border-b-8 border-amber-500 animate-scale-in"
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, rgba(6, 70, 50, 0.96), rgba(2, 28, 20, 0.91)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')`
        }}
      >
        
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-12 text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-800/60 border border-emerald-500/20 px-3.5 py-1.5 rounded-full mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200 font-mono">Desde 1932 no Campo brasileiro</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-sans max-w-4xl mx-auto leading-tight sm:leading-none">
              Shigueno
            </h1>
            
            <p className="text-xl sm:text-2xl text-emerald-100 font-medium max-w-3xl mx-auto italic font-sans">
              "{motto}"
            </p>

            <p className="text-emerald-200/90 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Aliando o legado histórico do Sr. Haruo Shigueno às mais avançadas tecnologias de adubação orgânica, colheita seletiva e bem-estar animal.
            </p>

            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => onNavigate('produtos')}
                className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 border border-amber-400"
              >
                <span>Conhecer Canais de Produção</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onNavigate('sobre')}
                className="bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold px-8 py-3.5 rounded-xl border border-emerald-600 transition-all"
              >
                Nossa História
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-amber-600 tracking-widest uppercase font-mono">Quatro Pilares de Excelência</h2>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans mt-1">
            Como Servimos a Mesa do Consumidor
          </p>
          <div className="w-16 h-1.5 bg-emerald-700 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={idx} 
                onClick={() => onNavigate('produtos', pillar.tab as any)}
                className={`flex flex-col rounded-3xl border ${pillar.borderColor} ${pillar.bgColor} p-5 shadow-xs hover:shadow-xl transition-all duration-550 transform hover:-translate-y-1.5 relative overflow-hidden group cursor-pointer animate-scale-in`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500"></div>
                
                {/* Image background block with hover scale trigger */}
                <div className="w-full h-36 rounded-2xl mb-4 overflow-hidden relative image-zoom-container border border-slate-200/20 shadow-xs">
                  <img 
                    src={pillar.image} 
                    alt={pillar.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent"></div>
                  
                  {/* Category icon inside circle */}
                  <div className="absolute bottom-3 left-3 inline-flex p-2.5 rounded-xl bg-white/95 text-slate-850 shadow-md backdrop-blur-xs">
                    <IconComponent className={`w-5 h-5 ${pillar.iconColor}`} />
                  </div>
                </div>

                <div className="mt-1">
                  <span className="text-[10px] font-bold text-emerald-850 uppercase tracking-wider bg-emerald-100/60 border border-emerald-200/40 px-2.5 py-1 rounded-md">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 font-sans mt-3 group-hover:text-amber-700 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mt-2 flex-grow">
                  {pillar.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-200/50 flex items-center justify-between text-xs font-bold text-emerald-850">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Conhecer o Segmento</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-all text-amber-600 group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Dynamic Callout for History */}
      <section className="bg-slate-50 border-y border-slate-150 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-5">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-850 font-bold font-mono">
              ★
            </div>
            <h3 className="text-sm font-bold text-emerald-700 tracking-wider uppercase font-mono">
              Origem & Pioneirismo
            </h3>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Saga da Família Shigueno no Brasil
            </h2>
            <p className="text-slate-650 text-sm leading-relaxed">
              {intro} Venceram desafios iniciais de adaptação e construíram um império baseado na perseverança.
            </p>
            <p className="text-slate-650 text-sm leading-relaxed">
              Sr. Haruo Shigueno visualizou o potencial da avicultura de postura e, em seguida, aproveitou o adubo orgânico para iniciar pomares de laranjas de extrema qualidade em Tatuí.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => onNavigate('sobre')}
                className="inline-flex items-center space-x-2 text-emerald-800 font-bold hover:text-emerald-950 text-sm"
              >
                <span>Conhecer a Cronologia Completa</span>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-2 border-l-4 border-emerald-600 pl-4">
              <p className="text-2xl font-black text-slate-900">1932</p>
              <p className="text-xs font-bold text-emerald-700 uppercase">Chegada ao Brasil</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Desembarque de Haruo Shigueno, estabelecendo laços e determinação para labuta na cafeicultura.
              </p>
            </div>

            <div className="space-y-2 border-l-4 border-emerald-600 pl-4">
              <p className="text-2xl font-black text-slate-900">1970</p>
              <p className="text-xs font-bold text-emerald-700 uppercase">Instalação em Tatuí - SP</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Montagem das instalações de postura na Fazenda Nova Aliança, escala industrial de ovos de alta qualidade.
              </p>
            </div>

            <div className="space-y-2 border-l-4 border-emerald-600 pl-4">
              <p className="text-2xl font-black text-slate-900">1975</p>
              <p className="text-xs font-bold text-emerald-700 uppercase">Fertilização com Adubo Orgânico</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aproveitamento inteligente do esterco das aves para pomares de citricultura em Tatuí-SP e Buri-SP.
              </p>
            </div>

            <div className="space-y-2 border-l-4 border-emerald-600 pl-4">
              <p className="text-2xl font-black text-slate-950">MT & SP</p>
              <p className="text-xs font-bold text-emerald-700 uppercase">Nelore de Altíssima Linhagem</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Expansão agropecuária para Santo Antônio do Leverger - MT, aplicando controles rigorosos de cria e recria.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Trabalhe Conosco CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg border border-emerald-700 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fec006_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="inline-block text-xs font-extrabold text-amber-400 tracking-[0.08em] uppercase font-mono bg-emerald-900/90 px-3.5 py-1.5 rounded-full border border-emerald-700/60 shadow-xs mb-2">
              Trabalhe com a gente
            </span>
            <h2 className="text-2xl sm:text-4.5xl font-black tracking-tight leading-tight pt-1">
              Junte-se à Família Shigueno
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Valorizamos profissionais dedicados, com o desejo de crescer em contato com a terra, avicultura sustentável e pecuária qualificada. Publique seu currículo em nosso processo unificado.
            </p>
          </div>

          <div className="shrink-0 relative z-10 self-start md:self-auto">
            <button 
              onClick={() => onNavigate('vagas')}
              className="bg-white hover:bg-slate-50 text-emerald-900 font-extrabold text-sm px-8 py-4 rounded-xl shadow transition-all hover:scale-[1.02] flex items-center justify-between space-x-2 border border-slate-100"
              id="goto-careers-cta"
            >
              <span>Ver Vagas Abertas</span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
