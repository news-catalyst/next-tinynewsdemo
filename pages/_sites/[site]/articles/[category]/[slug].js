import { useRouter } from 'next/router';
import React from 'react';
import {
  generateAllArticlePagePaths,
  hasuraArticlePage,
  hasuraCategoryPage,
  getOrgSettings,
} from '../../../../../lib/articles.js';
import {
  hasuraLocalizeText,
  booleanSetting,
} from '../../../../../lib/utils.js';
import { getArticleAds } from '../../../../../lib/ads.js';
import { cachedContents } from '../../../../../lib/cached';
import Article from '../../../../../components/Article.js';

export default function ArticlePage(props) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // trying to fix build errors...
  if (!props.article) {
    return (
      <>
        <h1>404 Page Not Found</h1>
      </>
    );
  }
  return <Article {...props} />;
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const paths = await generateAllArticlePagePaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: {},
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('Settings lookup error:', settingsResult.errors);
    throw settingsResult.errors;
  }

  let article = {};
  let sectionArticles = [];
  let sections = [];
  let locales = [];
  let publishedLocales = [];
  let siteMetadata;
  const { errors, data } = await hasuraArticlePage({
    url: apiUrl,
    site: site,
    categorySlug: params.category,
    slug: params.slug,
  });
  if (
    errors ||
    !data ||
    !data.article_slug_versions ||
    data.article_slug_versions.length === 0
  ) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    sections = data.categories;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocalizeText(
        locale,
        sections[i].category_translations,
        'title'
      );
    }

    locales = data.organization_locales;
    publishedLocales = data.published_article_translations;
    article = data.article_slug_versions[0].article;
    // article = data.articles.find((a) => a.slug === params.slug);

    const sectionResponse = await hasuraCategoryPage({
      url: apiUrl,
      site: site,
      categorySlug: params.category,
    });
    if (!sectionResponse.errors && sectionResponse.data) {
      sectionArticles = sectionResponse.data.articles.filter(
        (a) => a.slug !== params.slug
      );
    }
    siteMetadata = hasuraLocalizeText(
      locale,
      data.site_metadatas[0].site_metadata_translations,
      'data'
    );
  }

  let ads = [];

  let letterheadSetting = booleanSetting(
    settingsResult.data.settings,
    'LETTERHEAD_API_URL',
    false
  );
  if (letterheadSetting) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    ads = allAds.filter((ad) => ad.adTypeId === 164 && ad.status === 4);
  }

  let renderFooter = booleanSetting(
    settingsResult.data.settings,
    'RENDER_FOOTER',
    true
  );

  return {
    props: {
      article,
      sections,
      ads,
      siteMetadata,
      sectionArticles,
      renderFooter,
      locales,
      publishedLocales,
      locale,
    },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
}
