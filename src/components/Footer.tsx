import React from 'react';
import { Linkedin, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Quentin Colpart</h2>
            <p className="text-gray-400">Ingénieur en Systèmes d'information | Chef de projet</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              
              <a 
                href="https://www.linkedin.com/in/quentin-colpart/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              
            </div>
            <button 
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>Revenir au début</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Quentin Colpart. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;