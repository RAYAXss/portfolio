import React, { useState, useEffect } from 'react';
import { Menu, X, Linkedin, Mail } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <a 
            href="#hero" 
            className={`text-xl font-bold transition-colors ${
              scrolled ? 'text-blue-600' : 'text-white'
            }`}
          >
            Quentin COLPART
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="space-x-6">
              {['A propos', 'Compétences', 'Education', 'Expériences', 'Projets'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`font-medium hover:text-blue-500 transition-colors ${
                    scrolled ? 'text-gray-800' : 'text-white'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              
              <a 
                href="https://www.linkedin.com/in/quentin-colpart/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`hover:text-blue-500 transition-colors ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#contact"
                className={`hover:text-blue-500 transition-colors ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={scrolled ? 'text-gray-800' : 'text-white'} size={24} />
            ) : (
              <Menu className={scrolled ? 'text-gray-800' : 'text-white'} size={24} />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="py-4 flex flex-col space-y-4 bg-white rounded-lg mt-2 shadow-lg px-4">
              {['A propos', 'Compétences', 'Education', 'Expériences', 'Projets'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-800 font-medium hover:text-blue-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex items-center space-x-4 pt-2 border-t border-gray-200">
                
                <a 
                  href="https://www.linkedin.com/in/quentin-colpart/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-500 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="#contact"
                  className="text-gray-700 hover:text-blue-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;