import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { useSiteContent } from '../siteContent';

interface FooterProps {
  onChangeTab: (tab: string) => void;
}

export default function Footer({ onChangeTab }: FooterProps) {
  const { siteSettings, clinics, navItems } = useSiteContent();
  const footer = siteSettings.footer;

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (tab: string) => {
    onChangeTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick links follow the site navigation so they stay in sync automatically
  const quickLinks = navItems.filter((item) => item.destinationType === 'page' || !item.destinationType);

  return (
    <footer className="bg-brand-deep text-white/70 py-16 border-t border-white/5 text-left">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

        {/* Col 1 - Brand & Philosophy */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center space-x-3.5">
            <Logo forgeId="footer-logo" className="w-9 h-9 text-white hover:text-brand-accent transition-colors duration-300" />
            <div className="flex flex-col">
              <span className="font-serif text-base tracking-wider text-white uppercase font-semibold">
                {footer.brandTitle}
              </span>
              <span className="font-sans text-[7px] tracking-wider text-brand-accent font-semibold uppercase mt-1 leading-none">
                {footer.brandSubtitle}
              </span>
            </div>
          </div>
          <p className="font-sans text-xs font-light leading-relaxed text-white/50 max-w-xs">
            {footer.brandBlurb}
          </p>
          {footer.complianceBadge && (
            <div className="flex items-center space-x-2 text-white/50 text-xs">
              <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
              <span className="text-[10px]">{footer.complianceBadge}</span>
            </div>
          )}
        </div>

        {/* Col 2 - Quick links */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
            {footer.quickLinksTitle}
          </h4>
          <ul className="space-y-2.5 font-sans text-xs font-light text-white/60">
            {quickLinks.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleLinkClick(item.tab || item.destination || 'home')}
                  className="hover:text-brand-accent transition-colors cursor-pointer text-left"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 - Locations (auto from sedi) */}
        {footer.showSedi && clinics.length > 0 && (
          <div className="lg:col-span-3 space-y-4 font-sans text-xs font-light">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              {footer.sediTitle}
            </h4>
            <div className="space-y-4 text-white/50">
              {clinics.map((clinic) => (
                <div key={clinic.id}>
                  <p className="font-bold text-white/80">{clinic.city}</p>
                  <p>{clinic.address}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Col 4 - Back to Top + meta */}
        <div className="lg:col-span-2 flex flex-col justify-between items-start md:items-end">
          <button
            onClick={handleScrollToTop}
            className="p-3 bg-brand-dark hover:bg-brand-accent hover:text-brand-deep text-brand-accent border border-white/5 hover:border-brand-accent rounded-none transition-all duration-300 cursor-pointer self-start md:self-auto"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {footer.metaLines.length > 0 && (
            <div className="mt-8 text-left md:text-right text-[9px] text-white/30 font-sans tracking-wider space-y-1">
              {footer.metaLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Compliance block */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-white/5 font-sans text-[10px] text-white/40 space-y-3 leading-relaxed">
        {footer.legalText && <p>{footer.legalText}</p>}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] pt-4 text-white/30 font-light">
          <p>&copy; {new Date().getFullYear()} {footer.copyrightName}</p>
          {footer.policyLinks.length > 0 && (
            <div className="flex space-x-4 items-center">
              {footer.policyLinks.map((link, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-white/10">|</span>}
                  <a href={link.url || '#'} className="hover:text-brand-accent transition-colors">{link.label}</a>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
