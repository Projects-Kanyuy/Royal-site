// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import partnershipLogo from "../assets/logo.jpg";
import backgroundImage from "../assets/background1.jpg";

const HomePage = () => {
  return (
    <div
      className="relative flex justify-center items-center text-center text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-0"></div>

      <div className="relative z-10 flex flex-col items-center p-4 pt-24 pb-40">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-stroke">
          WIN 300,000 FCFA
        </h1>
        <h2 className="text-6xl sm:text-7xl md:text-8xl text-brand-gold font-black uppercase my-1 text-stroke">
          REGISTER NOW!
        </h2>
        <p className="text-base sm:text-lg text-gray-200">
          Free Registration | Voting at 100 FCFA per vote
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8">
          <Link
            to="/register"
            className="bg-brand-gold text-black font-bold py-3 px-8 rounded-md shadow-lg hover:brightness-110 transition"
          >
            Register as an Artist
          </Link>
          <Link
            to="/vote"
            className="bg-brand-gold text-black font-bold py-3 px-8 rounded-md shadow-lg hover:brightness-110 transition"
          >
            Vote now
          </Link>
        </div>

        <div className="mt-12 sm:mt-16">
          {/* <h3 className="text-4xl font-bold mb-4 text-stroke">
            Prize Pool: 500,000 FCFA
          </h3> */}
          <div className="space-y-2 text-xl sm:text-2xl md:text-3xl font-black text-stroke">
            <h2 className="text-2xl sm:text-3xl md:text-4xl">
              <span className="text-prize-red ">1st Prize:</span> 300,000 FCFA
            </h2>
            {/* <p><span className="text-prize-red">2nd Prize:</span> 150,000 FCFA</p>
            <p><span className="text-prize-red">3rd Prize:</span> 50,000 FCFA</p> */}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 sm:right-6 z-10">
        <div className="flex items-center bg-white text-dark-text p-2 rounded-lg shadow-md max-w-[280px] sm:max-w-none">
          <div className="bg-gray-100 rounded-md p-2">
            <FaUserShield className="text-gray-500 text-lg sm:text-xl" />
          </div>
          <div className="text-left mx-2 sm:mx-3">
            <h4 className="font-bold text-[10px] sm:text-xs uppercase">
              IN PARTNERSHIP WITH
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-500">
              Royal City Snack Bar
            </p>
          </div>
          <img
            src={partnershipLogo}
            alt="Partner Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
