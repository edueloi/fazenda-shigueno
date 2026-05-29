import React from 'react';
import { Map, Phone, Mail, FileText, ChevronRight, Share2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  siteSettings?: Record<string, string>;
}

export default function Footer({ onNavigate, siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 text-[#e6f4ea] pt-16 pb-8 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Shigueno Emblem & Motto */}
          <div className="space-y-4" id="footer-branding-column">
            <div className="flex items-center space-x-3">
              {/* Shield Mini representation in footer */}
              <div className="w-8 h-8 bg-white text-emerald-950 rounded-b-lg rounded-t-sm flex items-center justify-center font-bold font-sans text-lg border border-amber-500">
                S
              </div>
              <span className="text-xl font-extrabold tracking-tight uppercase text-white font-sans">
                Shigueno
              </span>
            </div>
            <p className="text-sm text-emerald-200/90 leading-relaxed font-sans mt-2">
              Uma empresa de tradição familiar, sempre dedicada à excelência agropecuária, citricultura e avicultura, com pleno respeito ao bem-estar e qualidade de vida.
            </p>
            <p className="text-xs text-emerald-300 font-mono">
              Fundada em Mogi das Cruzes e expandida com orgulho em Tatuí-SP e Leverger-MT.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-emerald-800 pb-2">
              Menu Institucional
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              {[
                { key: 'home', label: 'Início' },
                { key: 'sobre', label: 'Sobre a Família Shigueno' },
                { key: 'produtos', label: 'Setores de Produção' },
                { key: 'vagas', label: 'Trabalhe Conosco (Vagas)' },
                { key: 'contato', label: 'Nossas Unidades' }
              ].map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => onNavigate(link.key)}
                    className="flex items-center text-emerald-200/80 hover:text-white transition-colors group text-sm"
                  >
                    <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500 transform group-hover:translate-x-1 transition-transform" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-emerald-800 pb-2">
              Atendimento Central
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-3 text-amber-400 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">{siteSettings?.contact_phone || '(15) 3259-9710'}</p>
                  <p className="text-xs text-emerald-300/80">Sede Administrativa (Tatuí)</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-3 text-amber-400 shrink-0 mt-1" />
                <div>
                  <a href={`mailto:${siteSettings?.contact_email || 'sac@shigueno.com.br'}`} className="font-semibold hover:underline text-white">
                    {siteSettings?.contact_email || 'sac@shigueno.com.br'}
                  </a>
                  <p className="text-xs text-emerald-300/80">Fale Conosco Geral</p>
                </div>
              </li>
              <li className="flex items-start">
                <Share2 className="w-4 h-4 mr-3 text-amber-400 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Shigueno Agro</p>
                  <p className="text-xs text-emerald-300/80">CNPJ: 46.545.922/0001-32</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Location Map Action */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-emerald-800 pb-2">
              Localização da Sede
            </h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Rodovia Tatuí - Quadra, KM 1, S/N<br />
              Tatuí, São Paulo<br />
              CEP 18.270-970
            </p>
            
            {/* Interactive styled Action to view/download Map */}
            <a 
              href="https://maps.google.com/?q=Rodovia+Tatui+Quadra+KM+1+Tatui+SP" 
              target="_blank" 
              rel="noopener noreferrer"
              id="download-map-button"
              className="inline-flex items-center space-x-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-4 py-2.5 rounded-lg text-xs w-full justify-center transition-all shadow-md group border border-amber-400"
            >
              <Map className="w-4 h-4 group-hover:animate-bounce shrink-0" />
              <span>Ver Mapa Sede Shigueno</span>
            </a>
            <p className="text-[10px] text-center text-emerald-300/70">
              Download da rota offline para motoristas e fornecedores.
            </p>
          </div>

        </div>

        {/* Bottom Bar containing strict copyrights */}
        <div className="border-t border-emerald-900/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 font-sans space-y-4 sm:space-y-0">
          <p className="text-center sm:text-left leading-relaxed">
            Copyright © Mituaki Shigueno. Todos os direitos reservados.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> | </span>
            Desenvolvido por{' '}
            <a 
              href="http://www.develoi.com.br" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-black underline text-emerald-300 hover:text-amber-400 transition-colors"
            >
              Develoi Soluções Digitais
            </a>
          </p>
          <div className="flex space-x-4">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('sobre')}>Institucional</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('contato')}>Fazendas</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('login')}>Portal Administrativo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
