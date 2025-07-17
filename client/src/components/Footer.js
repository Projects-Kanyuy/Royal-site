// src/components/Footer.js
import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // <-- IMPORT THE LINK COMPONENT

const Footer = () => {
  return (
    <footer className="bg-bg-dark text-text-light">
      <div className="py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="bg-card-dark rounded-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            <div className="flex items-center gap-4 md:pr-8 md:border-r border-gray-600">
              <div className="bg-brand-gold rounded-full p-3 flex-shrink-0"><FaMapMarkerAlt className="text-white text-xl" /></div>
              <div><h3 className="font-bold">Office Address</h3><p className="text-sm text-gray-400">6 Auer Ct, Unit G, NJ 08816</p></div>
            </div>
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-8 md:border-t-0 md:border-r border-t border-gray-600">
              <div className="bg-brand-gold rounded-full p-3 flex-shrink-0"><FaEnvelope className="text-white text-xl" /></div>
              <div><h3 className="font-bold">Email Address</h3><p className="text-sm text-gray-400">testuser+otp@demo.com</p></div>
            </div>
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8 border-t border-gray-600 md:border-t-0">
              <div className="bg-brand-gold rounded-full p-3 flex-shrink-0"><FaPhoneAlt className="text-white text-xl" /></div>
              <div><h3 className="font-bold">Phone Number</h3><p className="text-sm text-gray-400">237676557264</p></div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-8 pb-12">
        <div className="container text-center max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-gold mb-4">About Us</h2>
          <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <div className="flex justify-center space-x-4 mt-8">
            <a href="#" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-brand-gold hover:text-white"><FaFacebookF /></a>
            <a href="#" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-brand-gold hover:text-white"><FaInstagram /></a>
            <a href="#" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-brand-gold hover:text-white"><FaTwitter /></a>
            <a href="#" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-brand-gold hover:text-white"><FaPhoneAlt /></a>
          </div>
        </div>
      </div>
      
      {/* --- THIS IS THE UPDATED SECTION --- */}
      <div className="border-t border-gray-700 text-center py-4">
        <p className="text-gray-500 text-sm">
          © Copyright 2025 testuser+otp@demo.com . All Rights Reserved
          <span className="mx-2">|</span>
          {/* Add a subtle link to the admin login page */}
          <Link to="/admin/login" className="hover:text-brand-gold transition-colors">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;