import React from 'react';
import { Award, Box, Clock, Compass, Heart, History, Leaf, Shield } from 'lucide-react';

interface SobreViewProps {
  siteSettings?: Record<string, string>;
}

export default function SobreView({ siteSettings }: SobreViewProps) {
  const intro = siteSettings?.about_text_intro || 'O patriarca da família Shigueno, Sr. Haruo Shigueno chegou ao Brasil em 1932. Na bagagem apenas vontade e determinação.';
  const fullText = siteSettings?.about_text_full || 'A princípio se estabeleceu na cidade de Aliança, noroeste do estado de SP, onde foram praticar a cafeicultura, decepcionando-se com o descumprimento do que lhes foi prometido, voltou e estabeleceu-se em Mogi das Cruzes. Numa época em que ninguém ousava criar galinhas comercialmente, Haruo Shigueno com 18 anos, começou a importar incubatórios e produzir pintinhos, dando início na atividade de avicultura na família. Com a expansão dos negócios, os irmãos Shigueno se separaram, ficando um irmão em Mogi das Cruzes e Haruo foi para São José dos Campos. Com a desapropriação sofrida pela Granja Shigueno em São José dos Campos, voltou-se o visionário Haruo Shigueno para a cidade de Tatuí, onde por volta de 1970 começou a montar sua granja.';
  const diversification = siteSettings?.about_diversification || 'Com a produção de ovos em maior escala, surgiu o esterco das aves e porque não aproveitá-lo para a citricultura? Foi aí que se iniciou, já em 1975, quando pouco se falava em adubação orgânica, iniciou-se a fertilização da terra com o esterco das galinhas em pomares de citricultura. Posteriormente estendeu a área de citros também para Buri - SP e cafeicultura em Itaí - SP, conseguindo graças à adubação orgânica uma produtividade invejável.';

  const timelineEvents = [
    {
      year: '1932',
      title: 'A Chegada ao Brasil',
      text: 'O patriarca Haruo Shigueno desembarca no porto brasileiro, trazendo apenas vontade de vencer nos cafezais do noroeste paulista.',
      icon: Compass,
      color: 'border-amber-400 bg-amber-50 text-amber-700'
    },
    {
      year: '1940s',
      title: 'Pioneirismo na Avicultura',
      text: 'Com apenas 18 anos em Mogi das Cruzes, Haruo importa incubadoras pioneiras e ensina a comunidade a criar aves de forma comercial organizada.',
      icon: Box,
      color: 'border-emerald-400 bg-emerald-50 text-emerald-800'
    },
    {
      year: '1970',
      title: 'Chegada a Tatuí - SP',
      text: 'Após desapropriações em São José dos Campos, o visionário adquire terras em Tatuí para lançar a Fazenda Nova Aliança, focada na postura em grande escala.',
      icon: History,
      color: 'border-blue-400 bg-blue-50 text-blue-700'
    },
    {
      year: '1975',
      title: 'A Revolução Ecológica',
      text: 'Adubação orgânica pioneira em pomares de citros com esterco aviário, gerando produtividades incríveis e frutos altamente adocicados.',
      icon: Leaf,
      color: 'border-green-400 bg-green-50 text-green-700'
    },
    {
      year: 'Expansão',
      title: 'Café & Agropecuária Nelore',
      text: 'Plantação de café de altitude arábica em Itaí-SP, seguida pelo ousado investimento de cria e recria do rebanho Nelore em Santo Antônio do Leverger, no Mato Grosso.',
      icon: Award,
      color: 'border-amber-500 bg-amber-100 text-amber-900'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-xs font-bold text-amber-600 tracking-widest uppercase font-mono">Sobre a Fazenda</h2>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans mt-2">
          Nossa História e Legado
        </h1>
        <p className="text-sm text-slate-500 mt-2">A trajetória da Fazenda Nova Aliança e o pioneirismo da Família Shigueno.</p>
        <div className="w-20 h-1.5 bg-emerald-800 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Main Narrative Layout: Row of Patriarch Haruo Shigueno */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-emerald-100/60 shadow-xs relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-br-full"></div>
        
        {/* Story copy */}
        <div className="lg:col-span-8 space-y-6 relative z-10 text-slate-755">
          <div className="inline-flex space-x-2 items-center bg-amber-100/65 text-amber-900 px-3 py-1 rounded-md text-xs font-bold font-mono">
            <span>Fundador da Dinastia</span>
          </div>
          
          <h2 className="text-2.5xl font-extrabold text-emerald-950 font-sans tracking-tight">
            Sr. Haruo Shigueno
          </h2>

          <p className="text-base text-slate-800 font-medium leading-relaxed italic border-l-4 border-amber-500 pl-4 bg-amber-50/30 py-2 pr-2 rounded-r-lg">
            "{intro}"
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600">
            A princípio se estabeleceu na cidade de Aliança, noroeste do estado de SP, onde foram praticar a cafeicultura, decepcionando-se com o descumprimento do que lhes foi prometido, voltou e estabeleceu-se em Mogi das Cruzes.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600">
            Numa época em que ninguém ousava criar galinhas comercialmente, Haruo Shigueno com 18 anos, começou a importar incubatórios e produzir pintinhos, dando início na atividade de avicultura na família.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600">
            Com a expansão dos negócios, os irmãos Shigueno se separaram, ficando um irmão em Mogi das Cruzes e Haruo foi para São José dos Campos.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600">
            Com a desapropriação sofrida pela Granja Shigueno em São José dos Campos, voltou-se o visionário Haruo Shigueno para a cidade de Tatuí, onde por volta de 1970 começou a montar sua granja.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600">
            Com a produção de ovos em maior escala, surgiu o esterco das aves e porque não aproveitá-lo para a citricultura?
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600">
            Foi aí que se iniciou, já em 1975, quando pouco se falava em adubação orgânica, iniciou-se a fertilização da terra com o esterco das galinhas em pomares de citricultura. Posteriormente estendeu a área de citros também para Buri - SP e cafeicultura em Itaí - SP, conseguindo graças à adubação orgânica uma produtividade invejável.
          </p>
        </div>

        {/* Founder Portrait Visual Frame */}
        <div className="lg:col-span-4 flex flex-col items-center relative z-10 self-start lg:sticky lg:top-6">
          <div className="relative bg-amber-50/70 p-4 rounded-3xl border-2 border-amber-100 shadow-md max-w-xs w-full transition-transform hover:scale-[1.02] duration-300">
            <div className="overflow-hidden rounded-2xl bg-slate-100 border border-amber-200">
              <img 
                src="/api/haruo-image" 
                alt="Sr. Haruo Shigueno" 
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/5] object-cover filter brightness-[102%] contrast-[101%] transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"; // safe backup professional portrait
                }}
              />
            </div>
            
            <div className="absolute top-8 right-8 bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm font-mono animate-pulse">
              Patriarca
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="font-extrabold text-slate-900 text-base">Sr. Haruo Shigueno</h3>
              <p className="text-2xs text-slate-500 font-bold uppercase tracking-widest font-mono mt-0.5">Fundador e Visionário</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Attributes: horizontal pilares showcase */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-950 text-emerald-50 p-6 rounded-2xl flex space-x-4 items-start shadow-xs">
          <div className="p-3 bg-emerald-900 rounded-xl text-amber-500 shrink-0">
            <Leaf className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Adubação 100% Orgânica</h4>
            <p className="text-xs text-emerald-250/90 mt-1 leading-relaxed">Pioneirismo iniciado em 1975 utilizando fertilização rica gerada em nossa própria granja de ovos.</p>
          </div>
        </div>

        <div className="bg-emerald-950 text-emerald-50 p-6 rounded-2xl flex space-x-4 items-start shadow-xs">
          <div className="p-3 bg-emerald-900 rounded-xl text-amber-500 shrink-0">
            <Heart className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Respeito e Bem-estar</h4>
            <p className="text-xs text-emerald-250/90 mt-1 leading-relaxed">Zelo com bem-estar animal desde as aves de postura até o rebanho Nelore em pastos rotacionados.</p>
          </div>
        </div>

        <div className="bg-emerald-950 text-emerald-50 p-6 rounded-2xl flex space-x-4 items-start shadow-xs">
          <div className="p-3 bg-emerald-900 rounded-xl text-amber-500 shrink-0">
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Tradição Sustentada</h4>
            <p className="text-xs text-emerald-250/90 mt-1 leading-relaxed">Família Shigueno presidindo o progresso com governança robusta focado no desenvolvimento regional.</p>
          </div>
        </div>
      </section>

      {/* Vertical Interactive Timeline */}
      <section className="space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-150">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Cronologia do Agro Shigueno</h3>
          <p className="text-xs text-slate-500 mt-1">Os marcos temporais que construíram a grandiosidade de nossas fazendas.</p>
        </div>

        <div className="relative border-l-2 border-emerald-250 ml-4 md:ml-12 pl-6 md:pl-8 space-y-10 max-w-4xl mx-auto">
          {timelineEvents.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div className={`absolute -left-[45px] md:-left-[53px] top-1.5 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${evt.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                {/* Content Box */}
                <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs group-hover:border-emerald-300 transition-colors">
                  <span className="text-sm font-extrabold text-amber-600 block font-mono">
                    {evt.year}
                  </span>
                  <h4 className="text-base font-bold text-slate-950 font-sans mt-0.5">
                    {evt.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed mt-2">
                    {evt.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
