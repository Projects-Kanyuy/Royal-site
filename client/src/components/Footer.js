// src/components/Footer.js
import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-bg-dark text-text-light">
      <div className="py-12">
        <div className="container max-w-5xl mx-auto">
          <div className="bg-card-dark rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Office Address */}
            <div className="flex items-center gap-4">
              <div className="bg-brand-gold rounded-full p-3 flex-shrink-0"><FaMapMarkerAlt className="text-white text-xl" /></div>
              <div>
                <h3 className="font-bold">Office Address</h3>
                <p className="text-sm text-gray-400">Rail, Bonaberi, Douala</p>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-center gap-4">
              <div className="bg-brand-gold rounded-full p-3 flex-shrink-0"><FaEnvelope className="text-white text-xl" /></div>
              <div>
                <h3 className="font-bold">Email Address</h3>
                <a href="royalcitysnack@gmail.com" className="text-sm text-gray-400 hover:text-brand-gold transition-colors">
                  royalcitysnack@gmail.com
                </a>
              </div>
            </div>

            {/* --- CORRECTED PHONE NUMBER LINK --- */}
            <div className="flex items-center gap-4">
              <div className="bg-brand-gold rounded-full p-3 flex-shrink-0"><FaPhoneAlt className="text-white text-xl" /></div>
              <div>
                <h3 className="font-bold">Phone Number</h3>
                {/* Wrap the number in an <a> tag with the tel: link */}
                <a href="tel:+237681122802" className="text-sm text-gray-400 hover:text-brand-gold transition-colors">
                  +237681122802
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* About Us and Socials Section */}
      <div className="pt-8 pb-12">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-gold mb-4">About Us</h2>
          <p className="text-gray-400">Welcome to ROCIMUC, the premier platform dedicated to discovering and celebrating the next generation of musical talent...</p>
          <div className="flex justify-center space-x-4 mt-8">
            <a href="https://www.facebook.com/share/1ZQi7nM3F6/?mibextid=qi2Omg" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-brand-gold hover:text-white"><FaFacebookF /></a>
            <a href="#" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-brand-gold hover:text-white"><FaInstagram /></a>
            <a href="#" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-brand-gold hover:text-white"><FaTwitter /></a>
            {/* Make the social phone icon also a clickable link */}
            <a href="tel:+237681122802" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-brand-gold hover:text-white"><FaPhoneAlt /></a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 text-center py-4">
        <p className="text-gray-500 text-sm">© Copyright 2025 All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;