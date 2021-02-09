import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  hasuraListAllArticleSlugs,
  hasuraArticlePage,
} from '../../../lib/articles.js';
import { hasuraLocaliseText } from '../../../lib/utils.js';
import { getArticleAds } from '../../../lib/ads.js';
import { cachedContents } from '../../../lib/cached';
import Article from '../../../components/Article.js';

export const config = { amp: 'hybrid' };

export default function ArticlePage(props) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (!props.article) {
      router.push('/404');
    }
  }, [props.article]);

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
  const { errors, data } = await hasuraListAllArticleSlugs();
  if (errors) {
    throw errors;
  }

  let paths = [];
  for (const article of data.articles) {
    for (const locale of article.article_translations) {
      paths.push({
        params: {
          category: article.category.slug,
          slug: article.slug,
        },
        locale: locale.locale_code,
      });
    }
  }

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let article = {};
  let sectionArticles = [];
  let sections = [];
  let siteMetadata;
  const { errors, data } = await hasuraArticlePage({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
    categorySlug: params.category,
  });
  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    sections = data.categories;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
    }

    article = data.articles.find((a) => a.slug === params.slug);
    sectionArticles = data.articles.filter((a) => a.slug !== params.slug);

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.log('failed finding site metadata for ', locale, metadatas);
    }
  }

  // const sections = await cachedContents('sections', listAllSections);
  const allAds = await cachedContents('ads', getArticleAds);
  const ads = allAds.filter((ad) => ad.adTypeId === 164);

  return {
    props: {
      article,
      locale,
      sections,
      ads,
      siteMetadata,
      sectionArticles,
    },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
}
