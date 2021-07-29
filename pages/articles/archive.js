import { useRouter } from 'next/router';
import Layout from '../../components/Layout.js';
import { hasuraArticlesArchivePage } from '../../lib/articles.js';
import { hasuraLocaliseText } from '../../lib/utils';
import { cachedContents } from '../../lib/cached';
import { getArticleAds } from '../../lib/ads.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';

export default function ArticlesArchivePage({
  sections,
  articles,
  siteMetadata,
  expandedAds,
}) {
  const router = useRouter();
  const isAmp = useAmp();
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <ArticleStream
        sections={sections}
        articles={articles}
        title={`Articles Archive`}
        showCategory={true}
        isAmp={isAmp}
        metadata={siteMetadata}
        ads={expandedAds}
      />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let articles = [];
  let sections = [];
  let siteMetadata;

  let locale = context.locale;
  let limit = context.query.limit || 10;
  let offset = context.query.offset || 0;

  const { errors, data } = await hasuraArticlesArchivePage({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
    limit: limit,
    offset: offset,
  });

  if (errors || !data) {
    return {
      notFound: true,
    };
  } else {
    articles = data.articles;
    sections = data.categories;

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.log('failed finding site metadata for ', locale, metadatas);
    }
  }

  let expandedAds = [];
  if (process.env.LETTERHEAD_API_URL) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => ad.adTypeId === 166 && ad.status === 4);
  }

  return {
    props: {
      sections,
      articles,
      siteMetadata,
      expandedAds,
    },
  };
}
