import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import InteractiveBackground from './components/background/InteractiveBackground';
import Aurora from './components/reactbits/Aurora';

import HomePage from './pages/HomePage';
import ComfyUIPage from './pages/ComfyUIPage';
import ClaudeSkillsPage from './pages/ClaudeSkillsPage';

import { useLanguage } from './hooks/useLanguage';
import { useTheme } from './hooks/useTheme';

function App() {
  const { lang } = useLanguage();
  const { theme } = useTheme();

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen">
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

      <div className="relative z-10">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comfyui" element={<ComfyUIPage />} />
          <Route path="/claude-skills" element={<ClaudeSkillsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
