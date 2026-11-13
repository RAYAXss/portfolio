import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
// Sous-pages chargées à la demande : three.js reste hors du bundle de l'accueil
const ComfyUIPage = React.lazy(() => import('./pages/ComfyUIPage'));
const ClaudeSkillsPage = React.lazy(() => import('./pages/ClaudeSkillsPage'));

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
        <React.Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comfyui" element={<ComfyUIPage />} />
          <Route path="/claude-skills" element={<ClaudeSkillsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </React.Suspense>
        <Footer />
      </div>
    </div>
  );
}

export default App;
