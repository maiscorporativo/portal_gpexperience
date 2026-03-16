import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventsSection from './components/EventsSection';
import PartnersMarquee from './components/PartnersMarquee';
import TrendingPackages from './components/TrendingPackages';
import PlatinumAccess from './components/PlatinumAccess';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ImageAdmin from './admin/ImageAdmin';

function SitePage() {
  return (
    <div className="min-h-screen bg-primary-main text-white selection:bg-gold selection:text-white pb-0">
      <Navbar />
      <HeroSection />
      <EventsSection />
      <PartnersMarquee />
      <TrendingPackages />
      <PlatinumAccess />
      <Testimonials />
      <Footer />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SitePage />} />
      <Route path="/admin" element={<ImageAdmin />} />
    </Routes>
  );
}

export default App;
