import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Treatments from './components/Treatments';
import Biography from './components/Biography';
import Clinics from './components/Clinics';
import Reviews from './components/Reviews';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

// New specialized subpages
import ChiSonoPage from './components/ChiSonoPage';
import ChirurgiaPage from './components/ChirurgiaPage';
import MedicinaPage from './components/MedicinaPage';
import MediaPage from './components/MediaPage';
import MediaDetailPage from './components/MediaDetailPage';
import StudioPage from './components/StudioPage';
import ContattiPage from './components/ContattiPage';
import TreatmentDetailPage from './components/TreatmentDetailPage';

import { Phone, CalendarCheck2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { treatmentPageForCategory, useSiteContent } from './siteContent';

export default function App() {
  const { siteSettings, treatments, treatmentCategories, media } = useSiteContent();
  const [currentTab, setCurrentTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCity, setModalCity] = useState('');
  const [modalTreatment, setModalTreatment] = useState('');

  const handleOpenBooking = (cityOrTreatment?: string) => {
    setModalCity('');
    setModalTreatment('');

    if (cityOrTreatment) {
      const value = cityOrTreatment.toLowerCase();
      if (['napoli', 'roma', 'milano'].includes(value)) {
        setModalCity(cityOrTreatment);
      } else {
        setModalTreatment(cityOrTreatment);
      }
    }
    setIsModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsModalOpen(false);
    setModalCity('');
    setModalTreatment('');
  };

  // Helper to switch page and scroll to top
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSectionChange = (destination: string, transition?: string) => {
    const [page, sectionId] = destination.split('#');
    if (!page || !sectionId) return;
    const isSamePage = currentTab === page;
    setCurrentTab(page);
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: transition === 'instant' ? 'auto' : 'smooth',
        block: 'start',
      });
    }, isSamePage ? 0 : 450);
  };

  const handleTreatmentChange = (destination: string) => {
    const treatmentId = destination.replace(/^treatment:/, '');
    const treatment = treatments.find((item) => item.id === treatmentId);
    if (!treatment) return;
    setCurrentTab(`treatment:${treatment.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMediaChange = (destination: string) => {
    const mediaId = destination.replace(/^media:/, '');
    const item = media.find((entry) => entry.id === mediaId);
    if (!item) return;
    setCurrentTab(`media:${item.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMedia = (mediaId: string) => {
    const item = media.find((entry) => entry.id === mediaId);
    if (!item) return;
    if (item.linkMode === 'external' && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    handleMediaChange(`media:${item.id}`);
  };

  useEffect(() => {
    const handleForgeNavigation = (event: Event) => {
      const detail = (event as CustomEvent<{ type: string; destination: string; transition?: string }>).detail;
      if (!detail) return;
      if (detail.type === 'external') {
        window.open(detail.destination, detail.destination.startsWith('http') ? '_blank' : '_self', 'noopener,noreferrer');
        return;
      }
      if (detail.type === 'action') {
        if (detail.destination === 'booking') handleOpenBooking();
        if (detail.destination === 'phone') window.location.href = 'tel:+3908119304567';
        if (detail.destination === 'email') window.location.href = 'mailto:info@drvincenzomazzarella.it';
        return;
      }
      if (detail.type === 'section') {
        if (currentTab !== 'home') setCurrentTab('home');
        window.setTimeout(() => {
          document.getElementById(detail.destination)?.scrollIntoView({ behavior: detail.transition === 'instant' ? 'auto' : 'smooth', block: 'start' });
        }, currentTab === 'home' ? 0 : 450);
        return;
      }
      if (detail.type === 'page-section') {
        handlePageSectionChange(detail.destination, detail.transition);
        return;
      }
      if (detail.type === 'treatment') {
        handleTreatmentChange(detail.destination);
        return;
      }
      if (detail.type === 'page') {
        if ((detail.destination || '').startsWith('treatment:')) {
          handleTreatmentChange(detail.destination);
          return;
        }
        if ((detail.destination || '').startsWith('media:')) {
          handleMediaChange(detail.destination);
          return;
        }
        handleTabChange(detail.destination || 'home');
      }
    };

    window.addEventListener('websites-forge-navigate', handleForgeNavigation);
    return () => window.removeEventListener('websites-forge-navigate', handleForgeNavigation);
  }, [currentTab, treatments, media]);

  return (
    <div className="min-h-screen bg-white font-sans text-brand-deep antialiased selection:bg-brand-accent selection:text-brand-deep overflow-x-hidden">
      
      {/* Premium Floating Header */}
      <Header 
        currentTab={currentTab} 
        onChangeTab={handleTabChange} 
        onOpenBooking={() => handleOpenBooking()} 
      />

      {/* Main Dynamic View Area */}
      <main className="min-h-[70vh]">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero Banner Section */}
              <Hero onOpenBooking={() => handleOpenBooking()} />

              {/* Slogan and Philosophic Pillar Statements */}
              <Philosophy />

              {/* Interactive Treatments Grid Explorer */}
              <Treatments onOpenTreatment={(treatmentId) => handleTreatmentChange(treatmentId)} />

              {/* Academic Curriculum and Core Values Summary */}
              <Biography />

              {/* Clinic location cards (Napoli, Roma, Milano) */}
              <Clinics onOpenBooking={(cityName) => handleOpenBooking(cityName)} />

              {/* Patient review carousel slider and review submit form */}
              <Reviews />

              {/* Permanent Inline Contact Form Section at Page Bottom */}
              {siteSettings.sections.contactFormVisible && <div id="contatto" className="py-12 bg-white">
                <BookingForm />
              </div>}
            </motion.div>
          )}

          {currentTab === 'chi-sono' && (
            <motion.div
              key="chi-sono"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <ChiSonoPage />
            </motion.div>
          )}

          {currentTab === 'chirurgia' && (
            <motion.div
              key="chirurgia"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <ChirurgiaPage onOpenTreatment={(treatmentId) => handleTreatmentChange(treatmentId)} />
            </motion.div>
          )}

          {currentTab === 'medicina' && (
            <motion.div
              key="medicina"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <MedicinaPage onOpenTreatment={(treatmentId) => handleTreatmentChange(treatmentId)} />
            </motion.div>
          )}

          {currentTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <MediaPage onOpenMedia={handleOpenMedia} />
            </motion.div>
          )}

          {currentTab === 'studio' && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <StudioPage />
            </motion.div>
          )}

          {currentTab === 'contatti' && (
            <motion.div
              key="contatti"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <ContattiPage onOpenBooking={handleOpenBooking} />
            </motion.div>
          )}

          {currentTab.startsWith('media:') && (
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {(() => {
                const mediaId = currentTab.replace(/^media:/, '');
                const item = media.find((entry) => entry.id === mediaId);
                if (!item) return <MediaPage onOpenMedia={handleOpenMedia} />;
                return (
                  <MediaDetailPage
                    media={item}
                    onBack={() => handleTabChange('media')}
                  />
                );
              })()}
            </motion.div>
          )}

          {currentTab.startsWith('treatment:') && (
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {(() => {
                const treatmentId = currentTab.replace(/^treatment:/, '');
                const treatment = treatments.find((item) => item.id === treatmentId);
                if (!treatment) return <ChirurgiaPage onOpenTreatment={(id) => handleTreatmentChange(id)} />;
                return (
                  <TreatmentDetailPage
                    treatment={treatment}
                    onBack={() => handleTabChange(treatmentPageForCategory(treatment.category, treatmentCategories))}
                    onOpenBooking={handleOpenBooking}
                  />
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Compliance-heavy footer including legal disclosures.
          Global master switch + per-page override (default / hidden / custom). */}
      {siteSettings.sections.footerVisible && (() => {
        const pageKey = currentTab.includes(':') ? currentTab.split(':')[0] : currentTab;
        const mode = siteSettings.footer.perPage?.[pageKey] ?? 'default';
        if (mode === 'hidden') return null;
        if (mode === 'custom') {
          const html = siteSettings.footer.customHtml?.[pageKey] ?? '';
          return <footer dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <Footer onChangeTab={handleTabChange} />;
      })()}

      {/* Dynamic Booking Modal Drawer */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingForm
            isOpenAsModal={true}
            onCloseModal={handleCloseBooking}
            preselectedCity={modalCity}
            preselectedTreatment={modalTreatment}
          />
        )}
      </AnimatePresence>

      {/* Floating Speed-Dial Contact Bar bottom right */}
      {siteSettings.sections.floatingActionsVisible && <div className="fixed bottom-6 right-6 z-35 flex flex-col space-y-3">
        {/* Telephone Call Floater */}
        <motion.a
          href="tel:+3908119304567"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="p-4 bg-white text-brand-deep border border-stone-200 rounded-none shadow-md hover:bg-brand-deep hover:text-white hover:border-brand-deep transition-all cursor-pointer flex items-center justify-center"
          title="Chiama la Segreteria"
        >
          <Phone className="w-5 h-5" />
        </motion.a>

        {/* Booking request modal floater */}
        <motion.button
          onClick={() => handleOpenBooking()}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="p-4 bg-brand-deep text-white rounded-none shadow-md hover:bg-brand-accent hover:text-brand-deep transition-all cursor-pointer flex items-center justify-center border border-brand-deep hover:border-brand-accent"
          title="Richiedi Consulenza"
        >
          <CalendarCheck2 className="w-5 h-5" />
        </motion.button>
      </div>}

    </div>
  );
}
