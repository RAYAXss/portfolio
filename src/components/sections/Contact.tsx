import React, { useRef, useState } from 'react';
import Section from '../ui/Section';
import Button from '../ui/Button';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import emailjs from 'emailjs-com';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

  const sendEmail = () => {
    if (!formRef.current) return;
    setIsSending(true);

    emailjs
      .sendForm(
        'service_bw1j0q4',
        'template_viehtya',
        formRef.current,
        'rvJKR7V5-KVvMt0h5'
      )
      .then(() => {
        alert('Message envoyé avec succès !');
        formRef.current?.reset();
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Erreur EmailJS :", error);
        alert(`Erreur lors de l'envoi du message : ${error.text || error.message || 'Erreur inconnue'}`);
      })
      .finally(() => setIsSending(false));
  };

  return (
    <>
      <hr className="border-t-2 border-gray-300 my-8" /> {/* Séparateur ajouté ici */}

      <Section
        id="contact"
        title="Me contacter"
        subtitle="N'hésitez pas à me contacter si vous avez des questions ou des opportunités."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de contact */}
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
                    <p className="text-gray-600">qcolpart@gmail.com</p>
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

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-6">Envoyez-moi un mail</h3>

              <form ref={formRef} onSubmit={handleOpenModal} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Votre adresse mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="jean.dupont@exemple.com"
                      required
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
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Comment puis-je vous aider ?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre message ici..."
                    required
                  ></textarea>
                </div>

                <div>
                  <Button type="submit" className="w-full sm:w-auto flex items-center justify-center">
                    <Send size={16} className="mr-2" />
                    Envoyer le mail
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal de confirmation */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Confirmation</h2>
              <p className="mb-6">Êtes-vous sûr de vouloir envoyer ce message ?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={sendEmail}
                  disabled={isSending}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isSending ? 'Envoi...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
};

export default Contact;
