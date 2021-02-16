import { hasuraStreamArticles } from '../lib/homepage.js';
import { cachedContents } from '../lib/cached';
import { hasuraGetHomepageEditor } from '../lib/articles.js';
import { getArticleAds } from '../lib/ads.js';
import { hasuraLocaliseText } from '../lib/utils.js';

import Homepage from '../components/Homepage';
import LandingPage from '../components/LandingPage';

export default function Home(props) {
  const component = props.siteMetadata.landingPage ? (
    <LandingPage {...props} />
  ) : (
    <Homepage {...props} />
  );

  return component;
}

export async function getStaticProps({ locale }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  const { errors, data } = await hasuraGetHomepageEditor({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
  });
  if (errors || !data) {
    console.error('error getting homepage data:', errors);
    throw errors;
  }

  const hpData = data.homepage_layout_datas[0];
  let selectedLayout = hpData.homepage_layout_schema;

  let ids = [];
  let featured = hpData.first_article;
  ids.push(featured.id);
  let topFeatured = hpData.second_article;
  if (topFeatured) {
    ids.push(topFeatured.id);
  }
  let bottomFeatured = hpData.third_article;
  if (bottomFeatured) {
    ids.push(bottomFeatured.id);
  }
  console.log('ids:', ids);

  const streamResult = await hasuraStreamArticles({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
    ids: ids,
  });
  let streamArticles = [];
  if (streamResult.errors || !streamResult.data) {
    console.error(
      'error getting stream articles:',
      streamResult.errors,
      streamResult.data
    );
  } else {
    streamArticles = streamResult.data.articles;
  }
  console.log('streamArticles:', streamArticles);

  const tags = data.tags;
  for (var i = 0; i < tags.length; i++) {
    tags[i].title = hasuraLocaliseText(tags[i].tag_translations, 'title');
  }

  const sections = data.categories;
  for (var i = 0; i < sections.length; i++) {
    sections[i].title = hasuraLocaliseText(
      sections[i].category_translations,
      'title'
    );
  }

  let siteMetadata;
  let metadatas = data.site_metadatas;
  try {
    siteMetadata = metadatas[0].site_metadata_translations[0].data;
  } catch (err) {
    console.log('failed finding site metadata for ', locale, metadatas);
  }

  const allAds = await cachedContents('ads', getArticleAds);
  const expandedAds = allAds.filter((ad) => ad.adTypeId === 166);

  return {
    props: {
      selectedLayout,
      featured,
      topFeatured,
      bottomFeatured,
      streamArticles,
      sections,
      locale,
      siteMetadata,
      expandedAds,
    },
    revalidate: 1,
  };
}
