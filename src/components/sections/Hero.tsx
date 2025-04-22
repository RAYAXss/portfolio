import React from 'react';
import { ArrowDown } from 'lucide-react';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  const scrollToAbout = () => {
    document.getElementById('a propos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/fond.jpg')] bg-cover bg-center opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
          Quentin COLPART
        </h1>
        <h2 className="text-xl md:text-3xl text-blue-200 mb-8 max-w-3xl mx-auto animate-fadeIn animation-delay-200">
          Ingénieur Généraliste | Chef de projet
        </h2>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-12 animate-fadeIn animation-delay-400">
          Concevoir et piloter des solutions techniques dans des environnements exigeants et réglementés
        </p>
        <div className="flex justify-center space-x-4 animate-fadeIn animation-delay-600">
          <Button 
            variant="primary" 
            size="lg"
            onClick={scrollToAbout}
          >
            Découvrer mes travaux
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:bg-opacity-10"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Me contacter
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 w-full text-center animate-bounce">
        <button
          onClick={scrollToAbout}
          className="text-white opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Scroll down"
        >
          <ArrowDown size={28} />
        </button>
      </div>
    </section>
  );
};

export default Hero;