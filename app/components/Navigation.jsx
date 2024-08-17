"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex justify-between p-5 items-center bg-white shadow-md">
      <div className="flex justify-between items-center w-full lg:w-auto">
        <div className="text-3xl font-bold">
          <Link href="/" onClick={handleLinkClick}>Calendar App</Link>
        </div>
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      <div
        className={`lg:flex lg:items-center lg:gap-4 absolute lg:static top-16 left-0 w-full lg:w-auto bg-white shadow-md lg:shadow-none ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        <Link href="/add" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:text-gray-900">Add Event</Link>
        <Link href="/view" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:text-gray-900">My Events</Link>
      </div>
    </div>
  );
};

export default Navigation;
