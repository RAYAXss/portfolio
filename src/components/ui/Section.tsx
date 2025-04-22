import React, { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  subtitle, 
  children, 
  className = '',
  dark = false
}) => {
  return (
    <section 
      id={id} 
      className={`py-20 ${dark ? 'bg-gray-900 text-white' : 'bg-white'} ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className={`text-lg ${dark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              {subtitle}
            </p>
          )}
          <div className={`mt-4 mx-auto w-20 h-1 ${dark ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
        </div>
        {children}
      </div>
    </section>
  );
};

export default Section;