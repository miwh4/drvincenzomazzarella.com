import { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { useSiteContent } from '../siteContent';
import type { NavItem } from '../siteContent';

interface HeaderProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export default function Header({ currentTab, onChangeTab, onOpenBooking }: HeaderProps) {
  const { drInfo, clinics, navItems, siteSettings } = useSiteContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOverlay = currentTab === 'home' && !isScrolled;

  const internalTabs = new Set(['home', 'chi-sono', 'chirurgia', 'medicina', 'media', 'studio', 'contatti']);

  const handleNavClick = (tab: string) => {
    setIsMobileMenuOpen(false);
    onChangeTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSectionClick = (destination: string, transition?: string) => {
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('websites-forge-navigate', {
      detail: { type: 'page-section', destination, transition },
    }));
  };

  const handleTreatmentClick = (destination: string, transition?: string) => {
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('websites-forge-navigate', {
      detail: { type: 'treatment', destination, transition },
    }));
  };

  const handleNavItemClick = (item: NavItem) => {
    const destinationType = item.destinationType || 'page';
    const destination = item.destination || item.tab;
    setIsMobileMenuOpen(false);

    if (destinationType === 'external') {
      window.open(destination, destination.startsWith('http') ? '_blank' : '_self', 'noopener,noreferrer');
      return;
    }

    if (destinationType === 'action') {
      if (destination === 'booking') onOpenBooking();
      if (destination === 'phone') window.location.href = 'tel:+3908119304567';
      if (destination === 'email') window.location.href = `mailto:${clinics[0]?.email || ''}`;
      return;
    }

    if (destinationType === 'section') {
      if (currentTab !== 'home') {
        onChangeTab('home');
      }
      window.setTimeout(() => {
        document.getElementById(destination)?.scrollIntoView({ behavior: item.transition === 'instant' ? 'auto' : 'smooth', block: 'start' });
      }, currentTab === 'home' ? 0 : 450);
      return;
    }

    if (destinationType === 'page-section') {
      handlePageSectionClick(destination, item.transition);
      return;
    }

    if (destinationType === 'treatment') {
      handleTreatmentClick(destination, item.transition);
      return;
    }

    if (destination.startsWith('treatment:')) {
      handleNavClick(destination);
      return;
    }

    handleNavClick(internalTabs.has(destination) ? destination : item.tab || 'home');
  };

  const activeTabForItem = (item: NavItem) => (
    (item.destinationType || 'page') === 'treatment'
      ? `treatment:${item.destination || ''}`
      : (item.destinationType || 'page') === 'page-section'
      ? (item.destination || '').split('#')[0] || item.tab
      : (item.destinationType || 'page') === 'page' ? item.destination || item.tab : item.tab
  );

  const renderDesktopSubmenu = (items: NavItem[], basePath: string, depth = 0) => (
    <div
      className={`nav-submenu ${depth === 0 ? 'nav-submenu-root' : 'nav-submenu-nested'} min-w-56 bg-white text-brand-deep shadow-xl border border-stone-200 py-2`}
    >
      {items.map((item, index) => {
        const itemPath = `${basePath}.${index}`;
        return (
        <div key={item.id} className="nav-menu-item relative">
          <button
            onClick={() => handleNavItemClick(item)}
            className="flex w-full items-center justify-between gap-4 text-left px-4 py-2 font-sans text-[11px] uppercase tracking-[0.12em] hover:bg-[#f4f5f8] hover:text-brand-accent"
          >
            <span data-forge-path={`${itemPath}.label`} className="inline-flex min-h-5 items-center">{item.label}</span>
            {item.children && item.children.length > 0 && <span className="text-brand-accent">›</span>}
          </button>
          {item.children && item.children.length > 0 && renderDesktopSubmenu(item.children, `${itemPath}.children`, depth + 1)}
        </div>
        );
      })}
    </div>
  );

  const renderMobileSubmenu = (items: NavItem[], basePath: string, depth = 0) => (
    <div className={`${depth === 0 ? 'pl-4' : 'pl-3'} pt-2 space-y-2 border-l border-stone-100`}>
      {items.map((item, index) => {
        const itemPath = `${basePath}.${index}`;
        return (
        <div key={item.id}>
          <button
            onClick={() => handleNavItemClick(item)}
            className="text-left font-sans text-xs uppercase tracking-wider text-brand-deep/60 hover:text-brand-accent w-full"
          >
            <span data-forge-path={`${itemPath}.label`} className="inline-flex min-h-5 items-center">{item.label}</span>
          </button>
          {item.children && item.children.length > 0 && renderMobileSubmenu(item.children, `${itemPath}.children`, depth + 1)}
        </div>
        );
      })}
    </div>
  );

  return (
    <>
      <header
        data-forge-id="site-header"
        data-header-tone={isOverlay ? 'dark' : 'light'}
        data-header-scrolled={isScrolled ? 'true' : 'false'}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/60 py-3.5'
            : isOverlay
              ? 'bg-stone-950/50 backdrop-blur-xs py-5 border-b border-white/5'
              : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/60 py-5'
        }`}
      >
        <div className={`${siteSettings.layout.menuWidth === 'full' ? 'w-full' : 'max-w-7xl mx-auto'} px-6 md:px-12 flex justify-between items-center`}>
          
          {/* Logo Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center space-x-3 text-left group min-w-0 max-w-[430px]"
            data-forge-id="header-brand"
          >
            <Logo forgeId="header-logo" className={`w-8 h-8 transition-colors duration-300 ${isOverlay ? 'text-white group-hover:text-brand-accent' : 'text-brand-deep group-hover:text-brand-accent'}`} />
            <div data-forge-id="header-brand-text" className="flex min-w-0 flex-col">
              <span data-forge-id="header-brand-name" data-forge-path="drInfo.name" className={`font-serif text-sm md:text-base xl:text-lg tracking-[0.08em] transition-colors duration-300 uppercase leading-tight ${isOverlay ? 'text-white group-hover:text-brand-accent' : 'text-brand-deep group-hover:text-brand-accent'}`}>
                {drInfo.name}
              </span>
              <span data-forge-id="header-brand-subtitle" data-forge-path="drInfo.title" className={`font-sans text-[6px] md:text-[7px] tracking-[0.12em] font-semibold uppercase mt-0.5 leading-tight transition-colors duration-300 ${isOverlay ? 'text-brand-accent' : 'text-brand-accent'}`}>
                {drInfo.title}
              </span>
            </div>
          </a>

          {/* Navigation Links Desktop */}
          <nav data-forge-id="header-menu" className="hidden xl:flex items-center gap-4 2xl:gap-5">
            {navItems.map((item, index) => {
              const isActive = currentTab === activeTabForItem(item);
              return (
                <div key={item.id} className="nav-menu-item relative">
                  <button
                    onClick={() => handleNavItemClick(item)}
                    data-forge-id={`header-menu-${item.id}`}
                    className={`font-sans text-[11px] 2xl:text-xs uppercase tracking-[0.12em] font-semibold py-1 transition-colors duration-200 relative cursor-pointer whitespace-nowrap ${
                      isActive
                        ? isOverlay ? 'text-white font-bold' : 'text-brand-deep font-bold'
                        : isOverlay ? 'text-stone-300 hover:text-brand-accent' : 'text-brand-deep/70 hover:text-brand-accent'
                    }`}
                  >
                    <span data-forge-path={`navItems.${index}.label`} className="inline-flex min-h-5 items-center">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="headerActiveIndicator"
                        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-accent"
                      />
                    )}
                  </button>
                  {item.children && item.children.length > 0 && renderDesktopSubmenu(item.children, `navItems.${index}.children`)}
                </div>
              );
            })}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden xl:flex items-center space-x-4" data-forge-id="header-cta">
            <button
              onClick={onOpenBooking}
              className={`font-sans text-[10px] uppercase tracking-[0.2em] font-bold px-4.5 py-2 transition-all duration-300 rounded-full cursor-pointer ${
                isOverlay
                  ? 'text-brand-deep bg-white border border-white hover:bg-brand-accent hover:border-brand-accent hover:text-white font-semibold'
                  : 'text-white bg-brand-deep border border-brand-deep hover:bg-brand-accent hover:border-brand-accent'
              }`}
            >
              Prenota Visita
            </button>
          </div>

          {/* Hamburger Menu Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`xl:hidden p-2 transition-colors ${isOverlay ? 'text-white hover:text-brand-accent' : 'text-brand-deep hover:text-brand-accent'}`}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-50 xl:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="w-full max-w-sm bg-white h-full shadow-2xl p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center space-x-2.5 text-left">
                    <Logo forgeId="mobile-menu-logo" className="w-7 h-7 text-brand-deep" />
                    <div className="flex flex-col">
                      <span className="font-serif text-sm tracking-[0.12em] text-brand-deep uppercase font-bold">
                        {drInfo.name}
                      </span>
                      <span className="font-sans text-[5.5px] tracking-wider text-brand-accent font-bold uppercase mt-0.5 leading-none">
                        {drInfo.title}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-brand-deep hover:text-brand-accent transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-5">
                  {navItems.map((item, index) => {
                    const isActive = currentTab === activeTabForItem(item);
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => handleNavItemClick(item)}
                          className={`text-left font-sans text-sm uppercase tracking-wider font-semibold border-b border-stone-50 pb-2.5 w-full cursor-pointer transition-colors ${
                            isActive
                              ? 'text-brand-deep border-brand-accent font-bold pl-2 border-l-2'
                              : 'text-brand-deep/70 hover:text-brand-accent'
                          }`}
                        >
                          <span data-forge-path={`navItems.${index}.label`} className="inline-flex min-h-5 items-center">{item.label}</span>
                        </button>
                        {item.children && item.children.length > 0 && renderMobileSubmenu(item.children, `navItems.${index}.children`)}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Quick Contacts */}
              <div className="border-t border-stone-100 pt-6 mt-6">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full max-w-[240px] mx-auto font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-white bg-brand-deep py-2.5 hover:bg-brand-accent transition-colors text-center block mb-4 rounded-full cursor-pointer"
                >
                  PRENOTA UNA VISITA
                </button>
                <div className="space-y-2 text-brand-deep/70 font-sans text-xs text-left">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-brand-accent" />
                    <span>+39 081 1930 4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                    <span>{clinics.map((clinic) => clinic.city).join(' • ')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
