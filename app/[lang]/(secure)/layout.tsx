import React, { ReactNode } from 'react';

interface SecureLayoutProps {
    children: ReactNode;
    params: { lang: 'da' | 'en' };
}

/**
 * Layout for alle sikre sider (f.eks. Dashboard).
 * Dette layout ombryder dine sidekomponenter (page.tsx) med den fælles struktur.
 * * Bemærk: Da DashboardPage.tsx indeholder sin egen header/Log Ud-knap, 
 * er dette layout minimalistisk.
 */
export default function SecureLayout({ children, params }: SecureLayoutProps) {
    // Vi behøver ikke at bruge params her, men vi skal modtage dem, da vi har en [lang] mappe
    
    return (
        // Wrapperen for at sikre, at indholdet fylder hele skærmen
        <div id="secure-layout" className="min-h-screen">
            {children}
        </div>
    );
}
