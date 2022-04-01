import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout.js';
import {
  hasuraTagPage,
  generateAllTagPagePaths,
} from '../../../../lib/tags.js';
import {
  booleanSetting,
  findSetting,
  getOrgSettings,
} from '../../../../lib/settings.js';
import { cachedContents } from '../../../../lib/cached';
import { avoidRateLimit } from '../../../../lib/utils';
import { getArticleAds } from '../../../../lib/ads.js';
import ArticleStream from '../../../../components/homepage/ArticleStream';

export default function TagPage({
  articles,
  tag,
  sections,
  siteMetadata,
  expandedAds,
  monkeypodLink,
  site,
}) {
  const router = useRouter();
  const isAmp = false;

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  let tagTitle = tag.tag_translations[0].title;

  // set page title
  siteMetadata['homepageTitle'] = tagTitle + ' | ' + siteMetadata['shortName'];

  return (
    <Layout
      meta={siteMetadata}
      sections={sections}
      monkeypodLink={monkeypodLink}
      site={site}
    >
      <ArticleStream
        articles={articles}
        sections={sections}
        showCategory={true}
        isAmp={isAmp}
        title={`Articles tagged with ${tagTitle}`}
        metadata={siteMetadata}
        ads={expandedAds}
        monkeypodLink={monkeypodLink}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const paths = await generateAllTagPagePaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: {},
  });
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  await avoidRateLimit();

  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;

  let articles = [];
  let sections = [];
  let tag;
  let siteMetadata;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('settings error:', settingsResult.errors);
    throw settingsResult.errors;
  }
  const settings = settingsResult.data.settings;
  const monkeypodLink = findSetting(settings, 'NEXT_PUBLIC_MONKEYPOD_URL');

  const { errors, data } = await hasuraTagPage({
    url: apiUrl,
    site: site,
    tagSlug: params.slug,
    localeCode: 'en-US',
  });

  if (errors || !data) {
    console.error('tag page errors', errors);
    return {
      notFound: true,
    };
  } else {
    tag = data.tags[0];

    if (!tag || tag === undefined) {
      return {
        notFound: true,
      };
    }

    tag.tag_articles.map((tag_article) => {
      articles.push(tag_article.article);
    });

    sections = data.categories;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = sections[i].category_translations[0]?.title;
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0]?.site_metadata_translations[0]?.data;
    } catch (err) {
      console.error('failed finding site metadata', metadatas);
    }
  }

  let ads = [];
  let letterheadSetting = booleanSetting(settings, 'LETTERHEAD_API_URL', false);
  if (letterheadSetting) {
    let letterheadParams = {
      url: findSetting(settings, 'LETTERHEAD_API_URL'),
      apiKey: findSetting(settings, 'LETTERHEAD_API_KEY'),
    };
    const allAds =
      (await cachedContents('ads', letterheadParams, getArticleAds)) || [];
    ads = allAds.filter((ad) => ad.adTypeId === 164 && ad.status === 4);
  }

  return {
    props: {
      articles,
      tag,
      sections,
      siteMetadata,
      ads,
      monkeypodLink,
      site,
    },
  };
}
