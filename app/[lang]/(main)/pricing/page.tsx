"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../../components/LanguageContext';
import { User, Shield, Star } from 'lucide-react';

// Hjælpe-komponent til check-ikoner
const CheckIcon = () => (
	<svg className="h-6 w-6 flex-none text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

// Hjælpe-komponent til et enkelt priskort
const PriceCard = ({ plan }: { plan: any }) => (
	<div className={`relative flex flex-col rounded-3xl p-8 ring-1 ${ plan.mostPopular ? 'ring-2 ring-orange-500' : 'ring-gray-200' }`}>
		{plan.mostPopular && (
			<div className="absolute top-0 -translate-y-1/2 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold tracking-wide text-white">
				{plan.mostPopular}
			</div>
		)}
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
        return <div className="pt-20 text-center">Loading Pricing...</div>;
    }

    const content = t.pricing;

    return (
        <main className="min-h-screen">
            {/* Hero Sektion */}
            <section className="relative py-20 sm:py-28 flex items-center text-white">
                <Image
                    src="/images/pricing.jpg"
                    alt={content.hero.title1 || "Pricing"}
                    fill
                    className="object-cover object-center z-0"
                    priority
                />
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                <div className="relative container mx-auto px-6 text-center z-20">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        {content.hero.title1}
                        <br />
                        <span className="text-orange-500">{content.hero.title2}</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">{content.hero.subtitle}</p>
                </div>
            </section>

            {/* Kategori-bokse */}
            <section className="bg-gray-50 py-16">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<a href="#trainer" className="group block text-center p-8 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
							<User className="h-12 w-12 mx-auto text-gray-400 group-hover:text-orange-500 transition-colors" strokeWidth={1.5} />
							<h3 className="mt-4 text-xl font-bold text-gray-900">{content.trainer.shortTitle}</h3>
						</a>
						<a href="#grassroots" className="group block text-center p-8 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
							<Shield className="h-12 w-12 mx-auto text-gray-400 group-hover:text-orange-500 transition-colors" strokeWidth={1.5} />
							<h3 className="mt-4 text-xl font-bold text-gray-900">{content.grassroots.shortTitle}</h3>
						</a>
						<a href="#academy" className="group block text-center p-8 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
							<Star className="h-12 w-12 mx-auto text-gray-400 group-hover:text-orange-500 transition-colors" strokeWidth={1.5} />
							<h3 className="mt-4 text-xl font-bold text-gray-900">{content.academy.shortTitle}</h3>
						</a>
					</div>
				</div>
			</section>

            {/* Pris-sektioner */}
            <section className="py-20 bg-white text-black">
                <div className="container max-w-7xl mx-auto px-4 space-y-20 md:space-y-24">
                    
                    <div id="trainer" className="scroll-mt-20">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
                            {content.trainer.categoryTitle}
                        </h2>
                        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            {content.trainer.plans.map((plan: any) => (
                                <PriceCard key={plan.name} plan={plan} />
                            ))}
                        </div>
                    </div>

                    <div id="grassroots" className="scroll-mt-20">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
                            {content.grassroots.categoryTitle}
                        </h2>
                        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            {content.grassroots.plans.map((plan: any) => (
                                <PriceCard key={plan.name} plan={plan} />
                            ))}
                        </div>
                    </div>
                    
                    <div id="academy" className="scroll-mt-20">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
                            {content.academy.categoryTitle}
                        </h2>
                        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
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