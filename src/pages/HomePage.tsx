import React from 'react';

import InteractiveBackground from '../components/background/InteractiveBackground';
import Aurora from '../components/reactbits/Aurora';

import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';

import { useTheme } from '../hooks/useTheme';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <InteractiveBackground
        background={isDark ? '#111827' : '#fffdfa'}
      />

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

      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
};

export default HomePage;
