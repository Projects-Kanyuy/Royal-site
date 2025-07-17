// src/pages/ContactPage.js
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const ContactPage = () => {
  // State for the form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend API
    console.log('Form Submitted:', formData);
    alert('Thank you for your message! We will get back to you shortly.');
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-text-dark">Get in Touch</h1>
        <p className="text-gray-600 mt-2">We'd love to hear from you. Please fill out the form below or reach out to us directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-text-dark mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-700">Message</label>
              <textarea
                name="message"
                id="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-brand-gold text-white font-bold py-3 px-6 rounded-md hover:bg-brand-gold-light transition-colors duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Contact Information */}
        <div className="space-y-8">
          <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-lg">
            <div className="bg-brand-yellow-vote rounded-full p-4 flex-shrink-0 cursor-pointer hover:bg-brand-gold-light" > 
              <FaMapMarkerAlt className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-dark ">Office Address</h3>
              <p className="text-gray-600">6 Auer Ct, Unit G, East Brunswick, NJ 08816</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-gold font-semibold mt-1 inline-block">
                Get Directions
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-lg">
            <div className="bg-brand-yellow-vote rounded-full p-4 flex-shrink-0 cursor-pointer hover:bg-brand-gold-light ">
              <FaEnvelope className="text-white text-2xl bg-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-dark">Email Us</h3>
              <p className="text-gray-600">testuser+otp@demo.com</p>
              <a href="mailto:testuser+otp@demo.com" className="text-brand-gold font-semibold mt-1 inline-block">
                Send an Email
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-lg">
            <div className="bg-brand-yellow-vote rounded-full p-4 flex-shrink-0 cursor-pointer hover:bg-brand-gold-light">
              <FaPhoneAlt className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-dark">Call Us</h3>
              <p className="text-gray-600">237676557264</p>
              <a href="tel:+237676557264" className="text-brand-gold font-semibold mt-1 inline-block">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;