import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ComfyUIPage from './pages/ComfyUIPage';
import ClaudeSkillsPage from './pages/ClaudeSkillsPage';

import { useLanguage } from './hooks/useLanguage';

function App() {
  const { lang } = useLanguage();

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comfyui" element={<ComfyUIPage />} />
          <Route path="/claude-skills" element={<ClaudeSkillsPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
