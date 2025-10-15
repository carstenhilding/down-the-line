"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../../../../components/LanguageContext';
import { Layers, BrainCircuit, Video, UserSquare, MessagesSquare } from 'lucide-react';

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
  points: string[];
  imageSrc: string;
};

export default function FeaturesPage({
    params: paramsPromise
}: {
    params: Promise<{ lang: 'da' | 'en' }>;
}) {
    const params = React.use(paramsPromise);
    const { lang } = params;
    const { t } = useLanguage();
    
    const [selectedFeature, setSelectedFeature] = useState(0);

    if (!t || !t.featuresPage) {
        return <div className="pt-20 text-center text-xl text-gray-700">Loading Features...</div>;
    }

    const content = t.featuresPage;

    const features: Feature[] = [
        { icon: Layers, title: content.feature1.title, description: content.feature1.description, points: content.feature1.points, imageSrc: "/images/session-planning.jpeg" },
        { icon: BrainCircuit, title: content.feature2.title, description: content.feature2.description, points: content.feature2.points, imageSrc: "/images/team-management.jpeg" },
        { icon: Video, title: content.feature3.title, description: content.feature3.description, points: content.feature3.points, imageSrc: "/images/tactical-analysis.jpeg" },
        { icon: UserSquare, title: content.feature4.title, description: content.feature4.description, points: content.feature4.points, imageSrc: "/images/placeholder-4.jpg" },
        { icon: MessagesSquare, title: content.feature5.title, description: content.feature5.description, points: content.feature5.points, imageSrc: "/images/placeholder-5.jpg" },
    ];

    const activeFeature = features[selectedFeature];

    return (
        <main className="min-h-screen">
            {/* HERO SEKTION (NU FULDT RESPONSIV) */}
            <section className="relative flex items-center text-white py-16 sm:py-20">
                <Image
                    src="/images/team-management.jpeg"
                    alt={content.hero.title1 || "Features"}
                    fill
                    className="object-cover object-center z-0"
                    priority
                />
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                <div className="relative container max-w-screen-2xl mx-auto px-6 lg:px-8 text-center z-20">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                        {content.hero.title1}
                        <br />
                        <span className="text-orange-500">{content.hero.title2}</span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                        {content.hero.subtitle}
                    </p>
                    <p className="mt-6 text-sm sm:text-base italic text-gray-300">
                        &quot;{content.hero.tagline}&quot;
                    </p>
                </div>
            </section>

            {/* INTERAKTIV FEATURE SEKTION (NU FULDT RESPONSIV) */}
            <section className="py-16 md:py-20 bg-white text-black">
                <div className="container max-w-screen-2xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Venstre Kolonne: Feature Vælger */}
                        <div className="lg:col-span-1">
                            <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Udforsk Vores Features</h2>
                            <div className="space-y-2">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    const isActive = selectedFeature === index;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedFeature(index)}
                                            className={`w-full flex items-center text-left p-4 rounded-lg transition-all duration-300 ${
                                                isActive 
                                                ? 'bg-orange-500 text-white shadow-lg' 
                                                : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <Icon className={`h-10 w-10 mr-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                                            <div>
                                                <h3 className="font-bold text-lg">{feature.title}</h3>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Højre Kolonne: Vist Feature i en "svævende" sort boks */}
                        <div className="lg:col-span-2">
                            <div className="bg-black text-white rounded-lg p-6 sm:p-8 shadow-2xl lg:sticky lg:top-28">
                                <div className="w-full h-64 sm:h-80 relative mb-6 rounded-md overflow-hidden">
                                    <Image
                                        src={activeFeature.imageSrc}
                                        alt={activeFeature.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-4">{activeFeature.title}</h3>
                                {/* --- RETTELSEN ER HER: className-strengen var ikke afsluttet korrekt --- */}
                                <p className="text-gray-300 mb-6">{activeFeature.description}</p>
                                <ul className="space-y-3">
                                    {activeFeature.points.map((point, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="h-6 w-6 flex-none text-orange-500 mr-3 mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            <span className="text-gray-200">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}