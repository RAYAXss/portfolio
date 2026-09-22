import React from 'react';

import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

import InteractiveBackground from './components/background/InteractiveBackground';
import Aurora from './components/reactbits/Aurora';

import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';

import { useLanguage } from './hooks/useLanguage';
import { useTheme } from './hooks/useTheme';

function App() {
  const { lang } = useLanguage();
  const { theme } = useTheme();

  // Update document lang attribute
  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen">
      {/* Global interactive background — fond + clic (messages/ondes), sans grille de points */}
      <InteractiveBackground
        background={isDark ? '#111827' : '#fffdfa'}
      />

      {/* Aurora overlay — entre le fond et le contenu */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-70">
        <Aurora
          colorStops={
            isDark
              ? ['#60a5fa', '#c084fc', '#60a5fa']
              : ['#c56b4a', '#e0c29a', '#c56b4a']
          }
          amplitude={1.1}
          blend={0.6}
          speed={0.7}
          lightMode={!isDark}
        />
      </div>

      {/* Portfolio content */}
      <div className="relative z-10">
        <Navigation />

        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
