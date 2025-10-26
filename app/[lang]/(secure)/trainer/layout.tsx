"use client"; // Tilføj use client for at tillade hooks i fremtiden, selvom det er en simpel layoutfil

import React, { ReactNode } from 'react';
// RETTET TIL KORREKT STIDYBDE: 3 niveauer op for at nå components fra /trainer/
import { Language } from '../../../../components/LanguageContext'; 

interface TrainerLayoutProps {
    children: ReactNode;
    params: { lang: Language };
}

/**
 * Dette layout omslutter alle træner-relaterede sider (Øvelsesbygger, Bibliotek).
 * Det sikrer, at disse sider deler den samme struktur.
 */
export default function TrainerLayout({ children, params }: TrainerLayoutProps) {
    return (
        <div id="trainer-layout" className="flex flex-col min-h-screen">
            {children}
        </div>
    );
}
