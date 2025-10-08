import React from 'react';
import { getTranslations } from '@/i18n'; // Sørg for at stien til din i18n-fil er korrekt

export async function generateMetadata({ params: { lang } }: { params: { lang: 'en' | 'da' } }) {
	const t = getTranslations(lang);
	const title = `${t.featuresPage.hero.title1} ${t.featuresPage.hero.title2}`;
	return {
		title: `${title} - Down The Line`,
		description: t.featuresPage.meta.description,
	};
}

const FeaturesPage = ({ params: { lang } }: { params: { lang: 'en' | 'da' } }) => {
	const t = getTranslations(lang);
	const content = t.featuresPage;

	return (
		<div className="bg-white text-gray-800">
			<section
				// OPDATERET: Afstanden (padding) er reduceret for at gøre sektionen lavere
				className="relative bg-cover bg-center py-20 sm:py-28"
				style={{
					backgroundImage: `url('/images/team-management.jpeg')`,
				}}
			>
				<div className="absolute inset-0 bg-black opacity-60"></div>

				<div className="relative container mx-auto px-6 text-center text-white">
					<h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
						{content.hero.title1}
						<br />
						<span className="text-orange-500">{content.hero.title2}</span>
					</h1>
					<p className="mt-6 text-lg leading-8 text-gray-300">
						{content.hero.subtitle}
					</p>
					<p className="mt-6 text-md italic text-white">"{content.hero.tagline}"</p>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-6 space-y-20">
					<Feature
						title={content.feature1.title}
						description={content.feature1.description}
						points={content.feature1.points}
						imagePlaceholder="Billede af platformen"
					/>
					<Feature
						title={content.feature2.title}
						description={content.feature2.description}
						points={content.feature2.points}
						imagePlaceholder="Billede af AI-analyse"
						imageLeft={true}
					/>
					<Feature
						title={content.feature3.title}
						description={content.feature3.description}
						points={content.feature3.points}
						imagePlaceholder="Billede af video-feedback"
					/>
					<Feature
						title={content.feature4.title}
						description={content.feature4.description}
						points={content.feature4.points}
						imagePlaceholder="Billede af spillerprofil"
						imageLeft={true}
					/>
					<Feature
						title={content.feature5.title}
						description={content.feature5.description}
						points={content.feature5.points}
						imagePlaceholder="Billede af kommunikations-hub"
					/>
				</div>
			</section>
		</div>
	);
};

// Hjælpe-komponent (uændret)
const Feature = ({
	title,
	description,
	points,
	imagePlaceholder,
	imageLeft = false,
}: {
	title: string;
	description: string;
	points: string[];
	imagePlaceholder: string;
	imageLeft?: boolean;
}) => (
	<div className={`flex flex-wrap items-center`}>
		<div
			className={`w-full md:w-1/2 ${
				imageLeft ? 'md:pl-10 md:order-2' : 'md:pr-10 md:order-1'
			}`}
		>
			<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
			<p className="text-gray-600 mb-6">{description}</p>
			<ul className="space-y-3">
				{points.map((point, index) => (
					<li key={index} className="flex items-start">
						<span className="text-orange-500 mr-3 mt-1 font-bold text-xl">✓</span>
						<span className="text-gray-700">{point}</span>
					</li>
				))}
			</ul>
		</div>
		<div className={`w-full md:w-1/2 mt-8 md:mt-0 ${imageLeft ? 'md:order-1' : 'md:order-2'}`}>
			<div className="bg-gray-200 w-full h-80 rounded-lg shadow-lg flex items-center justify-center">
				<p className="text-gray-500">{imagePlaceholder}</p>
			</div>
		</div>
	</div>
);

export default FeaturesPage;