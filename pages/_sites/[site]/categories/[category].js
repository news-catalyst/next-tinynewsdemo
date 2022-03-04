import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Layout from '../../../../components/Layout.js';
import { cachedContents } from '../../../../lib/cached';
import {
  hasuraCategoryPage,
  generateAllCategoryPagePaths,
  getOrgSettings,
} from '../../../../lib/articles.js';
import { getArticleAds } from '../../../../lib/ads.js';
import { getLatestVersion, booleanSetting } from '../../../../lib/utils.js';
import ArticleStream from '../../../../components/homepage/ArticleStream';
import {
  SectionContainer,
  SectionLayout,
  Block,
} from '../../../../components/common/CommonStyles';

export default function CategoryPage(props) {
  const isAmp = false;
  const router = useRouter();

  useEffect(() => {
    if (props.categoryExists === false) {
      router.push('/404');
    }
  }, [props.categoryExists, router]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  let siteMetadata = props.siteMetadata;
  // set page title
  siteMetadata['homepageTitle'] =
    props.title + ' | ' + siteMetadata['shortName'];

  return (
    <Layout
      meta={siteMetadata}
      sections={props.sections}
      renderFooter={props.renderFooter}
    >
      <ArticleStream
        articles={props.articles}
        sections={props.sections}
        showCategory={false}
        isAmp={isAmp}
        title={props.title}
        metadata={props.siteMetadata}
        ads={props.expandedAds}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const paths = await generateAllCategoryPagePaths({
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
  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;
  const locale = 'en-US';

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    throw settingsResult.errors;
  }

  const settings = settingsResult.data.settings;

  let articles = [];
  let sections = [];
  let tags = [];
  let siteMetadata;
  let title;
  let categoryExists = false;

  const { errors, data } = await hasuraCategoryPage({
    url: apiUrl,
    site: site,
    categorySlug: params.category,
    localeCode: 'en-US',
  });

  if (errors || !data) {
    console.error('error listing articles:', errors);
    return {
      notFound: true,
    };
  } else {
    articles = data.articles;
    sections = data.categories;

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = getLatestVersion(
        sections[i].category_translations,
        'title'
      );
      if (sections[i].slug == params.category) {
        categoryExists = true;
        title = getLatestVersion(sections[i].category_translations, 'title');
      }
    }

    for (var j = 0; j < tags.length; j++) {
      tags[j].title = getLatestVersion(tags[j].tag_translations, 'title');
    }

    let metadatas = data.site_metadatas;
    console.log('data.site_metadatas:', data.site_metadatas);

    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error('failed finding site metadata for ', locale, metadatas);
    }
  }

  if (!title) {
    title = params.category;
  }

  let expandedAds = [];
  let letterheadSetting = booleanSetting(settings, 'LETTERHEAD_API_URL', false);
  if (letterheadSetting) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => ad.adTypeId === 166 && ad.status === 4);
  }

  let renderFooter = booleanSetting(settings, 'RENDER_FOOTER', true);

  return {
    props: {
      articles,
      categoryExists,
      tags,
      title,
      sections,
      siteMetadata,
      expandedAds,
      renderFooter,
      settings,
    },
  };
}
