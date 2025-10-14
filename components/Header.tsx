"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from './LanguageContext';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const changeLang = (newLang: 'da' | 'en') => {
    setIsOpen(false);
    setLanguage(newLang);
    const currentPathWithoutLang = pathname.startsWith(`/${language}`) ? pathname.substring(`/${language}`.length) : pathname;
    const newPath = `/${newLang}${currentPathWithoutLang === '/' ? '' : currentPathWithoutLang}`;
    router.push(newPath);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!t) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-white text-black py-4 shadow-md text-center">
        Loading...
      </header>
    );
  }

  const isActive = (path: string) => {
    if (path === `/${language}`) return pathname === `/${language}`;
    return pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 bg-white transition-shadow duration-300 ease-in-out ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
      <div className={`mx-auto flex max-w-screen-2xl items-center justify-between px-4 sm:px-6 transition-all duration-300 ease-in-out ${isScrolled ? 'py-2' : 'py-4'}`}>
        
        <Link href={`/${language}`} className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Down The Line Logo"
            // --- OPDATERING HER: Logo-størrelse er sat tilbage til den store version ---
            width={isScrolled ? 180 : 250}
            height={isScrolled ? 33 : 46}
            priority
            className="transition-all duration-300"
          />
        </Link>

        {/* Hamburger Menu Knap */}
        <div className="lg:hidden">
            <button onClick={toggleMenu} className="text-gray-800 focus:outline-none" aria-label="Toggle menu">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>}
                </svg>
            </button>
        </div>

        {/* Højre sektion: Hele menuen samlet */}
        <nav className="hidden lg:flex lg:items-center lg:gap-x-4">
          <Link href={`/${language}`} className={`font-semibold hover:text-orange-500 transition-colors ${isActive(`/${language}`) ? 'text-orange-500' : 'text-black'}`}>{t.headerHome}</Link>
          <Link href={`/${language}/features`} className={`font-semibold hover:text-orange-500 transition-colors ${isActive(`/${language}/features`) ? 'text-orange-500' : 'text-black'}`}>{t.headerFeatures}</Link>
          <Link href={`/${language}/pricing`} className={`font-semibold hover:text-orange-500 transition-colors ${isActive(`/${language}/pricing`) ? 'text-orange-500' : 'text-black'}`}>{t.headerPricing}</Link>
          <Link href={`/${language}/about`} className={`font-semibold hover:text-orange-500 transition-colors ${isActive(`/${language}/about`) ? 'text-orange-500' : 'text-black'}`}>{t.headerAbout}</Link>
          
          <div className="flex items-center gap-x-2 ml-2">
            <Link href={`/${language}/login`} className="font-semibold border border-black text-black px-5 py-2 rounded-md transition-colors hover:bg-black hover:text-white">{t.headerLogin}</Link>
            <Link href={`/${language}/signup`} className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-orange-600 transition-colors">{t.headerJoin}</Link>
            <div className="flex items-center space-x-2 text-gray-800 font-semibold pl-2">
                <button onClick={() => changeLang('da')} className={`hover:text-orange-500 transition-colors ${language === 'da' ? 'text-orange-500' : ''}`}>DA</button>
                <span className="h-4 w-px bg-gray-400"></span>
                <button onClick={() => changeLang('en')} className={`hover:text-orange-500 transition-colors ${language === 'en' ? 'text-orange-500' : ''}`}>EN</button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobil Navigation */}
      <div className={`transition-all duration-300 ease-in-out lg:hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <nav className="flex flex-col space-y-4 p-4 border-t border-gray-200 bg-white">
            <Link href={`/${language}`} className={`font-semibold block py-2 text-center hover:text-orange-500 transition-colors ${isActive(`/${language}`) ? 'text-orange-500' : 'text-black'}`}>{t.headerHome}</Link>
            <Link href={`/${language}/features`} className={`font-semibold block py-2 text-center hover:text-orange-500 transition-colors ${isActive(`/${language}/features`) ? 'text-orange-500' : 'text-black'}`}>{t.headerFeatures}</Link>
            <Link href={`/${language}/pricing`} className={`font-semibold block py-2 text-center hover:text-orange-500 transition-colors ${isActive(`/${language}/pricing`) ? 'text-orange-500' : 'text-black'}`}>{t.headerPricing}</Link>
            <Link href={`/${language}/about`} className={`font-semibold block py-2 text-center hover:text-orange-500 transition-colors ${isActive(`/${language}/about`) ? 'text-orange-500' : 'text-black'}`}>{t.headerAbout}</Link>
            
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Link href={`/${language}/login`} className="font-semibold border border-black text-black px-6 py-2 rounded-md transition-colors hover:bg-black hover:text-white text-center">{t.headerLogin}</Link>
                <Link href={`/${language}/signup`} className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-orange-600 transition-colors text-center">{t.headerJoin}</Link>
            </div>

            <div className="flex items-center justify-center space-x-4 pt-4 text-gray-800 font-semibold">
                <button onClick={() => changeLang('da')} className={`hover:text-orange-500 transition-colors ${language === 'da' ? 'text-orange-500' : ''}`}>DA</button>
                <span className="h-4 w-px bg-gray-400"></span>
                <button onClick={() => changeLang('en')} className={`hover:text-orange-500 transition-colors ${language === 'en' ? 'text-orange-500' : ''}`}>EN</button>
            </div>
        </nav>
      </div>
    </header>
  );
}