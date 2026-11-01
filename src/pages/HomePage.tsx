import React from 'react';

import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';
import ExploreCards from '../components/sections/ExploreCards';

const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <ExploreCards />
      <Contact />
    </main>
  );
};

export default HomePage;
