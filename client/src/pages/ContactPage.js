// src/pages/ContactPage.js
import React, { useState } from 'react';
import apiClient from '../api/axios'; // Use our configured API client
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Send the form data to our new backend endpoint
      await apiClient.post('/api/messages', formData);
      setSuccess('Message sent successfully! We will get back to you soon.');
      // Reset the form on success
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-text-dark">Get in Touch</h1>
        <p className="text-gray-600 mt-2">We'd love to hear from you. Please fill out the form below or reach out to us directly.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-text-dark mb-6">Send us a Message</h2>
          
          {/* Display Success and Error Messages */}
          {error && <div className="text-center text-red-600 p-3 bg-red-100 rounded-md mb-4">{error}</div>}
          {success && <div className="text-center text-green-600 p-3 bg-green-100 rounded-md mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label htmlFor="name" className="block text-sm font-bold text-gray-700">Full Name</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md" /></div>
            <div><label htmlFor="email" className="block text-sm font-bold text-gray-700">Email Address</label><input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md" /></div>
            <div><label htmlFor="subject" className="block text-sm font-bold text-gray-700">Subject</label><input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md" /></div>
            <div><label htmlFor="message" className="block text-sm font-bold text-gray-700">Message</label><textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md"></textarea></div>
            <div><button type="submit" disabled={loading} className="w-full bg-brand-gold text-white font-bold py-3 px-6 rounded-md hover:bg-brand-gold-light disabled:bg-gray-500 transition-colors">{loading ? 'Sending...' : 'Send Message'}</button></div>
          </form>
        </div>
        <div className="space-y-8">
          <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-lg"><div className="bg-brand-yellow-vote rounded-full p-4 cursor-pointer hover:bg-brand-gold-light"><FaMapMarkerAlt className="text-white text-2xl" /></div><div><h3 className="text-xl font-bold">Office Address</h3><p className="text-gray-600">Rail, Bonaberi, Douala</p><a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-gold font-semibold mt-1 inline-block">Get Directions</a></div></div>
          <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-lg"><div className="bg-brand-yellow-vote rounded-full p-4 cursor-pointer hover:bg-brand-gold-light"><FaEnvelope className="text-white text-2xl" /></div><div><h3 className="text-xl font-bold">Email Us</h3><p className="text-gray-600">royalcitysnack@gmail.com</p><a href="royalcitysnack@gmail.com" className="text-brand-gold font-semibold mt-1 inline-block">Send an Email</a></div></div>
          <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-lg"><div className="bg-brand-yellow-vote rounded-full p-4 cursor-pointer hover:bg-brand-gold-light"><FaPhoneAlt className="text-white text-2xl" /></div><div><h3 className="text-xl font-bold">Call Us</h3><a href="tel:+23767679267153" className="text-gray-600 hover:text-brand-gold">+237681122802</a><br /><a href="tel:+237681122802" className="text-brand-gold font-semibold mt-1 inline-block">Call Now</a></div></div>
        </div>
      </div>
    </div>
  );
};
export default ContactPage;