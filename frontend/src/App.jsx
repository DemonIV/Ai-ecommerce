import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { CookieBanner, FlashBanner, Navbar, Hero, Footer, Toast } from './components/Layout';
import { Shop } from './components/Shop';
import { About } from './components/About';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { ModalsContainer } from './components/Modals';
import { ObserverPanel } from './components/ObserverPanel';
import { PopupAd } from './components/Popups';
import { Chatbot } from './components/Chatbot';
import { LiveNotifications } from './components/LiveNotifications';
import { HeatmapTracker, HeatmapModal } from './components/Heatmap';
import './index.css';

const MainContent = () => {
  const { activePage } = useAppContext();
  const [heatmapOpen, setHeatmapOpen] = useState(false);

  return (
    <>
      <CookieBanner />
      <FlashBanner />
      <Navbar />
      {activePage === 'Shop' && <Hero />}

      {activePage === 'Shop' && <Shop />}
      {activePage === 'About' && <About />}
      {activePage === 'Auth' && <Auth />}
      {activePage === 'Profile' && <Profile />}

      <ModalsContainer />
      <ObserverPanel />
      <PopupAd />
      <Toast />
      <Footer />
      <Chatbot />
      <LiveNotifications />
      <HeatmapTracker />
      {heatmapOpen && <HeatmapModal onClose={() => setHeatmapOpen(false)} />}

      {/* Heatmap toggle button */}
      <button
        onClick={() => setHeatmapOpen(true)}
        title="Isı Haritasını Aç"
        style={{
          position: 'fixed', bottom: '90px', right: '20px', zIndex: 900,
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B00, #FF3547)',
          color: '#fff', border: 'none', fontSize: '22px',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,53,71,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        🌡️
      </button>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
