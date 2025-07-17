// src/pages/RegisterPage.js
import React, { useState } from 'react';
import apiClient from '../api/axios';
import { FaCloudUploadAlt, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', age: '', stageName: '', cellNumber: '', whatsappNumber: '', bio: '' });
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password field
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onFileChange = (e) => setProfilePictureFile(e.target.files[0]);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!profilePictureFile) {
        setError('Please upload a profile picture.');
        return;
    }

    setLoading(true);
    const submissionData = new FormData();
    for (const key in formData) { submissionData.append(key, formData[key]); }
    submissionData.append('profilePicture', profilePictureFile);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      await apiClient.post('/api/artists/register', submissionData, config);
      setSuccess('Registration successful! You can now log in from the Profile page.');
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-light py-12">
      <div className="container max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Register as an Artist</h2>
        
        {error && <div className="text-center text-red-600 p-3 bg-red-100 rounded-md mb-4">{error}</div>}
        {success && <div className="text-center text-green-600 p-3 bg-green-100 rounded-md mb-4">{success}</div>}
        
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div><label htmlFor="name" className="block text-sm font-bold text-gray-700">Name:</label><input type="text" name="name" onChange={onChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md" /></div>
          <div><label htmlFor="email" className="block text-sm font-bold text-gray-700">Email:</label><input type="email" name="email" onChange={onChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md" /></div>
          
          {/* --- PASSWORD FIELD WITH TOGGLE --- */}
          <div>
            <label htmlFor="password"  className="block text-sm font-bold text-gray-700">Password:</label>
            <div className="relative mt-1">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                value={formData.password}
                onChange={onChange} 
                required 
                className="block w-full p-3 pr-10 border border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400"/> : <FaEye className="h-5 w-5 text-gray-400"/>}
              </div>
            </div>
          </div>
          
          {/* --- CONFIRM PASSWORD FIELD WITH TOGGLE --- */}
          <div>
            <label htmlFor="confirmPassword"  className="block text-sm font-bold text-gray-700">Confirm Password:</label>
            <div className="relative mt-1">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="block w-full p-3 pr-10 border border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400"/> : <FaEye className="h-5 w-5 text-gray-400"/>}
              </div>
            </div>
          </div>
          
          <div><label htmlFor="age" className="block text-sm font-bold text-gray-700">Age:</label><input type="number" name="age" onChange={onChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md" /></div>
          <div><label htmlFor="stageName" className="block text-sm font-bold text-gray-700">Stage Name:</label><input type="text" name="stageName" onChange={onChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md" /></div>
          <div className="md:col-span-2"><label htmlFor="cellNumber" className="block text-sm font-bold text-gray-700">Cell Number:</label><input type="tel" name="cellNumber" onChange={onChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md" /></div>
          <div className="md:col-span-2"><label htmlFor="whatsappNumber" className="block text-sm font-bold text-gray-700">WhatsApp Number (Optional):</label><input type="tel" name="whatsappNumber" onChange={onChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" /></div>
          <div className="md:col-span-2"><label htmlFor="bio" className="block text-sm font-bold text-gray-700">Tell us about yourself:</label><textarea name="bio" rows="4" onChange={onChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md"></textarea></div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700">Upload a picture:</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-dashed border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-gold hover:text-brand-gold-light">
                    <span>Upload a file</span>
                    <input id="file-upload" name="profilePicture" type="file" className="sr-only" onChange={onFileChange} required />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">{profilePictureFile ? profilePictureFile.name : 'PNG, JPG, GIF up to 10MB'}</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 text-center">
            <button type="submit" disabled={loading} className="w-1/2 mt-4 py-3 px-4 rounded-md text-lg font-bold text-white bg-brand-gold hover:bg-brand-gold-light disabled:bg-gray-400 transition-colors">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RegisterPage;