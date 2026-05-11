import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, type = 'website', path = '' }) {
  const siteName = 'SnapStudy | Newton School of Technology';
  const fullTitle = title ? `${title} | SnapStudy` : siteName;
  const canonicalUrl = `https://snapstudy.nst.ac.in${path}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content="@SnapStudyNST" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
