"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '../components/LanguageContext';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // State for when user has scrolled

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const changeLang = (newLang: 'da' | 'en') => {
    setIsOpen(false);
    setLanguage(newLang);

    const currentPathWithoutLang = pathname.startsWith(`/${language}`) 
                                   ? pathname.substring(`/${language}`.length)
                                   : pathname;
    const newPath = `/${newLang}${currentPathWithoutLang === '/' ? '' : currentPathWithoutLang}`;

    router.push(newPath);
  };

  // Effect to handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if scroll position is greater than 50px
      setIsScrolled(window.scrollY > 50);
    };

    // Add event listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  if (!t) {
    return (
      // Fixed position for loading header to prevent layout shift
      <header className="fixed top-0 left-0 w-full z-50 bg-white text-black py-4 shadow-md text-center">
        Loading Header Translations...
      </header>
    );
  }

  return (
    <header 
      // Always fixed and white background
      className={`
        fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 ease-in-out
        ${isScrolled ? 'py-2 shadow-lg' : 'py-1'} {/* Smaller padding and shadow when scrolled */}
        text-black {/* Default text color for the header */}
      `}
    >
      <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex flex-col items-start space-y-0"
        >
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Down The Line Logo"
              width={isScrolled ? 150 : 300} // Dynamic logo size
              height={isScrolled ? 22 : 44}   // Dynamic logo size
              priority
            />
          </div>
        </Link>

        {/* Hamburgermenu-knap for mobil */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-800 focus:outline-none" // Default color for hamburger icon
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12" 
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" 
              ></path>
            )}
          </svg>
        </button>

        {/* Navigation, knapper og sprogvælger */}
        <nav
          className={`${
            isOpen ? 'block' : 'hidden' 
          } absolute md:relative top-full left-0 w-full md:w-auto bg-white shadow-md md:shadow-none p-4 md:p-0 z-20 
          md:flex md:items-center md:space-x-6`} 
        >
          {/* Navigationslinks */}
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 text-lg md:text-base text-black"> {/* Default text color for links */}
            <li>
              <Link 
                href="/" 
                className="hover:text-orange-500 block" 
                onClick={() => setIsOpen(false)}
              >
                {t.headerHome}
              </Link>
            </li>
            <li>
              <Link 
                href="/features" 
                className="hover:text-orange-500 block" 
                onClick={() => setIsOpen(false)}
              >
                {t.headerFeatures}
              </Link>
            </li>
            <li>
              <Link 
                href="/pricing" 
                className="hover:text-orange-500 block" 
                onClick={() => setIsOpen(false)}
              >
                {t.headerPricing}
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="hover:text-orange-500 block" 
                onClick={() => setIsOpen(false)}
              >
                {t.headerAbout}
              </Link>
            </li>
          </ul>

          {/* Login og Opret knapper */}
          <div className="flex flex-col md:flex-row items-center md:space-x-4 mt-4 md:mt-0 md:ml-6 space-y-3 md:space-y-0">
            <Link
              href="/login" 
              className="font-semibold border border-black text-black px-6 py-2 rounded-md transition-colors hover:bg-black hover:text-white block w-full md:w-auto text-center" // Black border, black text
              onClick={() => setIsOpen(false)}
            >
              {t.headerLogin}
            </Link>
            <Link 
              href="/signup" 
              className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-orange-600 transition-colors block w-full md:w-auto text-center" 
              onClick={() => setIsOpen(false)}
            >
              {t.headerJoin}
            </Link>
          </div>

          {/* Sprogvælger */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-6 text-gray-800 font-semibold"> {/* Default text color for language selector */}
            <button
              onClick={() => changeLang('da')}
              className={`hover:text-orange-500 transition-colors ${language === 'da' ? 'text-orange-500' : ''}`}
            >
              DA
            </button>
            <span className="h-4 w-px bg-gray-400"></span> {/* Default color for divider */}
            <button
              onClick={() => changeLang('en')}
              className={`hover:text-orange-500 transition-colors ${language === 'en' ? 'text-orange-500' : ''}`}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}