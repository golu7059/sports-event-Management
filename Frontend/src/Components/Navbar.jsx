import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);  

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 text-white shadow-lg w-full">
      <div className="container mx-auto w-full flex justify-between items-center px-4 py-4 border-spacing-y-1">
        {/* Brand */}
        <div className="text-3xl font-extrabold tracking-wide">
          Let&apos;s Play
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium">
          <a href="#" className="hover:text-gray-200 transition duration-300">
            Home
          </a>
          <a href="#" className="hover:text-gray-200 transition duration-300">
            Search matches
          </a>
          <a href="#" className="hover:text-gray-200 transition duration-300">
            Upcoming matches
          </a>
          <a href="#" className="hover:text-gray-200 transition duration-300">
            {isLogin ? "Logout" : "Login"}  
          </a>
          <a href="#" className="hover:text-gray-200 transition duration-300">
            Profile
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-purple-700 text-white">
          <a
            href="#"
            className="block py-3 px-6 text-lg hover:bg-purple-800 transition duration-300"
          >
            Home
          </a>
          <a
            href="#"
            className="block py-3 px-6 text-lg hover:bg-purple-800 transition duration-300"
          >
            About
          </a>
          <a
            href="#"
            className="block py-3 px-6 text-lg hover:bg-purple-800 transition duration-300"
          >
            Services
          </a>
          <a
            href="#"
            className="block py-3 px-6 text-lg hover:bg-purple-800 transition duration-300"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
