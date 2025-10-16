"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../../components/LanguageContext';
import { User, Shield, Star } from 'lucide-react';

// Hjælpe-komponent til check-ikoner (uændret)
const CheckIcon = () => (
    <svg className="h-6 w-6 flex-none text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Hjælpe-komponent til et enkelt priskort (Inkluderer Orange Hover Effekt)
const PriceCard = ({ plan }: { plan: any }) => (
    // Fjernet Most Popular, Tilføjet Orange Hover Effekt
    <div className="relative flex flex-col rounded-3xl p-8 ring-1 ring-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:ring-2 hover:ring-orange-500">
        
        <div className="flex-grow">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
            <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                {plan.period && (
                    <span className="text-sm font-semibold leading-6 text-gray-600">{plan.period}</span>
                )}
            </p>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {plan.features.map((feature: string) => (
                    <li key={feature} className="flex gap-x-3">
                        <CheckIcon />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
        <Link
            href="#"
            className="mt-8 block rounded-md bg-orange-500 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600"
        >
            {plan.buttonText}
        </Link>
    </div>
);


export default function PricingPage({
    params: paramsPromise
}: {
    params: Promise<{ lang: 'da' | 'en' }>;
}) {
    const params = React.use(paramsPromise);
    const { lang } = params;
    const { t } = useLanguage();

    if (!t || !t.pricing) {
        return <div className="pt-20 text-center text-xl text-gray-700">Loading Pricing...</div>;
    }

    const content = t.pricing;

    return (
        <main className="min-h-screen">
            {/* Hero Sektion (uændret) */}
            <section className="relative flex items-center text-white py-16 sm:py-20">
                <Image
                    src="/images/pricing.jpg"
                    alt={content.hero.title1 || "Pricing"}
                    fill
                    className="object-cover object-center z-0"
                    priority
                />
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                <div className="relative container max-w-6xl mx-auto px-4 text-center z-20">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        {content.hero.title1}
                        <br />
                        <span className="text-orange-500">{content.hero.title2}</span>
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                        {content.hero.subtitle}
                    </p>
                </div>
            </section>

            {/* Kategori-bokse (py-16 er ændret til py-12) */}
            <section className="bg-gray-50 py-12">
                <div className="container max-w-screen-2xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <a href="#trainer" className="group flex items-center justify-between p-6 bg-black rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <User className="h-14 w-14 text-orange-500" strokeWidth={1.5} />
                            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase">{content.trainer.shortTitle}</h3>
                            <div className="w-14"></div>
                        </a>
                        <a href="#grassroots" className="group flex items-center justify-between p-6 bg-black rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <Shield className="h-14 w-14 text-orange-500" strokeWidth={1.5} />
                            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase">{content.grassroots.shortTitle}</h3>
                            <div className="w-14"></div>
                        </a>
                        <a href="#academy" className="group flex items-center justify-between p-6 bg-black rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <Star className="h-14 w-14 text-orange-500" strokeWidth={1.5} />
                            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase">{content.academy.shortTitle}</h3>
                            <div className="w-14"></div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Pris-sektioner (pt-20 ændret til pt-12, Overskrift redesignet, STREG LÆNGERE) */}
            <section className="pt-12 pb-20 bg-white text-black">
                <div className="container max-w-screen-2xl mx-auto px-6 lg:px-8 space-y-20 md:space-y-24">
                    
                    <div id="trainer" className="scroll-mt-20">
                        {/* NY OVERSKRIFT STYLING - w-20 ændret til w-28 */}
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                                {content.trainer.categoryTitle}
                            </h2>
                            <div className="h-1 w-28 bg-orange-500 mx-auto mt-4 rounded"></div>
                        </div>
                        {/* END NY OVERSKRIFT STYLING */}
                        
                        <div className="mx-auto mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {content.trainer.plans.map((plan: any) => (
                                <PriceCard key={plan.name} plan={plan} />
                            ))}
                        </div>
                    </div>

                    <div id="grassroots" className="scroll-mt-20">
                        {/* NY OVERSKRIFT STYLING - w-20 ændret til w-28 */}
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                                {content.grassroots.categoryTitle}
                            </h2>
                            <div className="h-1 w-28 bg-orange-500 mx-auto mt-4 rounded"></div>
                        </div>
                        {/* END NY OVERSKRIFT STYLING */}
                        
                        <div className="mx-auto mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {content.grassroots.plans.map((plan: any) => (
                                <PriceCard key={plan.name} plan={plan} />
                            ))}
                        </div>
                    </div>
                    
                    <div id="academy" className="scroll-mt-20">
                        {/* NY OVERSKRIFT STYLING - w-20 ændret til w-28 */}
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                                {content.academy.categoryTitle}
                            </h2>
                            <div className="h-1 w-28 bg-orange-500 mx-auto mt-4 rounded"></div>
                        </div>
                        {/* END NY OVERSKRIFT STYLING */}

                        <div className="mx-auto mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {content.academy.plans.map((plan: any) => (
                                <PriceCard key={plan.name} plan={plan} />
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}