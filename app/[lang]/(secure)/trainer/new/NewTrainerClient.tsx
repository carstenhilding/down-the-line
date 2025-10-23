// app/[lang]/(secure)/trainer/new/NewTrainerClient.tsx (HELT TOM SIDE)

"use client";

import React from 'react';
// Vi fjerner alle unødvendige imports for at undgå fejl
// import { useRouter } from 'next/navigation'; // Ikke nødvendig for en tom side

interface NewTrainerClientProps {
    // Vi beholder props, da serveren sender dem
    trainerTranslations: { [key: string]: string };
    lang: 'da' | 'en';
}

export default function NewTrainerClient({ trainerTranslations, lang }: NewTrainerClientProps) {

    // Returnerer en tom fragment (siden er tom)
    return (
        <></> 
    );
}