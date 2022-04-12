import Head from 'next/head';

export default function TwitterMeta({ siteMetadata, override }) {
  return (
    <Head>
      <meta
        name="twitter:title"
        content={
          override.title || siteMetadata.twitterTitle || siteMetadata.shortName
        }
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:description"
        content={
          override.description ||
          siteMetadata.twitterDescription ||
          siteMetadata.searchDescription
        }
      />
      {siteMetadata.siteTwitter && (
        <meta name="twitter:site" content={'@' + siteMetadata.siteTwitter} />
      )}
      {override.author && (
        <meta name="twitter:creator" content={`@${override.author}`} />
      )}
      <meta
        name="twitter:image"
        content={override.image || siteMetadata.defaultSocialImage}
      />
    </Head>
  );
}
