"use client";

import React from 'react';
import { Inter } from 'next/font/google'; // Importér Inter her
import Header from './Header'; // Sti til Header
import { LanguageProvider } from './LanguageContext'; // Sti til LanguageContext

const inter = Inter({ subsets: ["latin"] }); // Initialiser Inter her

export default function Body({ children }: { children: React.ReactNode }) {
  return (
    <body className={inter.className}> {/* Anvend inter.className her */}
      <LanguageProvider>
        <Header />
        {children}
      </LanguageProvider>
    </body>
  );
}