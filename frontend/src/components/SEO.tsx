import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
}

const SEO = ({ title, description, image, article }: SEOProps) => {
  const router = useRouter();
  const defaultTitle = 'Collège Le Flambeau | Excellence & Discipline';
  const defaultDescription = "Institution d'excellence académique à Haïti. Formation intégrale de la maternelle au baccalauréat.";
  const siteName = 'Collège Le Flambeau';
  const twitterHandle = '@leflambeau';
  const domain = 'https://collegeleflambeau.edu'; // À adapter plus tard

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || '/images/og-image.jpg';
  const seoUrl = `${domain}${router.asPath}`;

  return (
    <Head>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="image" content={seoImage} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <meta name="theme-color" content="#D32D3F" />
    </Head>
  );
};

export default SEO;
