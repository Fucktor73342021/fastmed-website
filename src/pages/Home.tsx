import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/sections/HeroSection';
import AppUISection from '@/sections/AppUISection';
import FounderSection from '@/sections/FounderSection';
import AmbitionSection from '@/sections/AmbitionSection';
import LegalSection from '@/sections/LegalSection';
import ContactSection from '@/sections/ContactSection';
import Footer from '@/sections/Footer';

export default function Home() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize any scroll-based animations or effects
    const handleScroll = () => {
      // Could add scroll progress tracking here
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-fastmed-navy overflow-x-hidden">
      {/* Fixed background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-fastmed-navy via-[#0a0a1a] to-fastmed-navy" />
        {/* Subtle animated gradient orbs */}
        <div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <AppUISection />
          <FounderSection />
          <AmbitionSection />
          <LegalSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
