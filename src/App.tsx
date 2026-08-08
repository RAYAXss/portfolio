import React from 'react';

import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

import KineticGrid from './components/background/InteractiveBackground';

import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';

import { useLanguage } from './hooks/useLanguage';

function App() {
  const { lang } = useLanguage();

  // Update document lang attribute
  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen">
      {/* Global interactive background */}
      <KineticGrid />

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
