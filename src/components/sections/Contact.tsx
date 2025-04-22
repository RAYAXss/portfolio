import React from 'react';
import Section from '../ui/Section';
import Button from '../ui/Button';
import { MapPin, Mail, Phone, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <Section 
      id="contact" 
      title="Me contacter"
      subtitle="N'hésitez pas à nous contacter si vous avez des questions ou des opportunités."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="text-blue-600 mr-4 mt-1" size={20} />
                <div>
                  <h4 className="font-medium">Localisation</h4>
                  <p className="text-gray-600">Montesson, Paris, France</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="text-blue-600 mr-4 mt-1" size={20} />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <a href="mailto:qcolpart@gmail.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                    qcolpart@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="text-blue-600 mr-4 mt-1" size={20} />
                <div>
                  <h4 className="font-medium">Téléphone</h4>
                  <a href="tel:+33652781019" className="text-gray-600 hover:text-blue-600 transition-colors">
                    +33 6 52 78 10 19
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Suivez moi</h3>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://www.linkedin.com/in/quentin-colpart/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6">Envoyez-moi un mail</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Votre adresse mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="jean.dupont@exemple.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Objet
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Comment puis-je vous aider ?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre message ici..."
                ></textarea>
              </div>
              
              <div>
                <Button className="w-full sm:w-auto flex items-center justify-center">
                  <Send size={16} className="mr-2" />
                  Envoyer le mail
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;