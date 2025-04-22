import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title = 'Mini AI Apps Gallery',
  description = 'Collection of specialized AI tools to supercharge your productivity',
  path = '',
  article = false,
  appData = null 
}) => {
  const siteUrl = 'https://miniai.apps'; // Replace with actual domain
  const defaultImage = '/assets/images/og-image.jpg';
  const fullUrl = `${siteUrl}${path}`;

  // Schema.org markup
  const schemaOrgWebPage = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    url: fullUrl,
    headline: title,
    description: description,
    image: defaultImage,
    publisher: {
      '@type': 'Organization',
      name: 'Mini AI Apps',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/images/logo.png`
      }
    }
  };

  // Additional schema for AI apps
  const appSchema = appData ? {
    '@context': 'http://schema.org',
    '@type': 'SoftwareApplication',
    name: appData.name,
    description: appData.description,
    applicationCategory: 'Artificial Intelligence',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: appData.price || '0',
      priceCurrency: 'USD'
    }
  } : null;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph tags */}
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content="Mini AI Apps Gallery" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />

      {/* Schema.org markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgWebPage)}
      </script>
      {appData && (
        <script type="application/ld+json">
          {JSON.stringify(appSchema)}
        </script>
      )}

      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />

      {/* PWA related tags */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/assets/images/logo192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    </Helmet>
  );
};

export default SEO;