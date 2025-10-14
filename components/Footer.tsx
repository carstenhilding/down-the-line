"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'; 

export default function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  if (!t) {
    return (
      <footer className="bg-black text-white py-8 text-sm text-center">
        <p className="text-xs">&copy; {currentYear} Down The Line. Loading...</p>
      </footer>
    );
  }

  return (
    <footer className="bg-black text-gray-400 text-xs">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-y-8 md:flex-row md:justify-between">
          
          {/* Venstre sektion: Logo */}
          <div className="text-center md:text-left">
            <span className="font-bold text-base uppercase text-white">DOWN THE LINE</span>
          </div>

          {/* Center sektion: Copyright (centreret) */}
          <div className="text-center">
            <p>&copy; {currentYear} Down The Line. {t.allRightsReserved}</p>
          </div>

          {/* Højre sektion: Links og Sociale Medier samlet */}
          <div className="flex items-center gap-x-6 md:gap-x-8">
            <nav>
              <ul className="flex justify-center gap-x-6">
                <li>
                  <Link href={`/${language}/privacy`} className="hover:text-orange-500 transition-colors">
                    {t.privacyPolicy}
                  </Link>
                </li>
                <li>
                  <Link href={`/${language}/terms`} className="hover:text-orange-500 transition-colors">
                    {t.termsOfService}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex justify-center gap-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <FaFacebookF size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                <span className="sr-only">Instagram</span>
                <FaInstagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                <span className="sr-only">YouTube</span>
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}