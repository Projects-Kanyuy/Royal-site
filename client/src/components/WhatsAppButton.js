// src/components/WhatsAppButton.js
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // --- IMPORTANT ---
  // The phone number must be in international format without the '+', spaces, or dashes.
  const phoneNumber = '237681122802'; // Replace with your exact number
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-brand-whatsapp text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-4xl" />
    </a>
  );
};

export default WhatsAppButton;