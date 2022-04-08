import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Layout from '../../../../components/Layout.js';
import { cachedContents } from '../../../../lib/cached';
import {
  hasuraCategoryPage,
  generateAllCategoryPagePaths,
} from '../../../../lib/section.js';

import {
  booleanSetting,
  findSetting,
  getOrgSettings,
} from '../../../../lib/settings.js';
import { getArticleAds } from '../../../../lib/ads.js';
import ArticleStream from '../../../../components/homepage/ArticleStream';
import {
  SectionContainer,
  SectionLayout,
  Block,
} from '../../../../components/common/CommonStyles';
import { NextSeo } from 'next-seo';

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

  console.log(props.slug);

  return (
    <Layout
      meta={siteMetadata}
      sections={props.sections}
      renderFooter={props.renderFooter}
      monkeypodLink={props.monkeypodLink}
      site={props.site}
    >
      <ArticleStream
        articles={props.articles}
        sections={props.sections}
        showCategory={false}
        isAmp={isAmp}
        title={props.title}
        metadata={props.siteMetadata}
        ads={props.expandedAds}
        site={props.site}
        monkeypodLink={props.monkeypodLink}
      />

      <NextSeo
        title={props.title || siteMetadata.searchTitle}
        description={siteMetadata.searchDescription}
        canonical={`${siteMetadata.siteUrl}/categories/${props.slug}`}
        openGraph={{
          title: props.title || siteMetadata.searchTitle,
          description:
            siteMetadata.facebookDescription || siteMetadata.searchDescription,
          url: `${siteMetadata.siteUrl}/categories/${props.slug}`,
          images: [
            {
              url: siteMetadata.defaultSocialImage,
              width: siteMetadata.defaultSocialImageWidth,
              height: siteMetadata.defaultSocialImageHeight,
            },
          ],
        }}
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
  const monkeypodLink = findSetting(settings, 'NEXT_PUBLIC_MONKEYPOD_URL');

  let articles = [];
  let sections = [];
  let tags = [];
  let siteMetadata;
  let title;
  let categoryExists = false;
  let slug;

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
      sections[i].title = sections[i].category_translations[0].title;
      if (sections[i].slug == params.category) {
        categoryExists = true;
        title = sections[i].category_translations[0].title;
        slug = title.toLowerCase();
      }
    }

    for (var j = 0; j < tags.length; j++) {
      tags[j].title = tags[j].tag_translations[0].title;
    }

    let metadatas = data.site_metadatas;
    // console.log('data.site_metadatas:', data.site_metadatas);

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
    let letterheadParams = {
      url: findSetting(settings, 'LETTERHEAD_API_URL'),
      apiKey: findSetting(settings, 'LETTERHEAD_API_KEY'),
    };
    const allAds =
      (await cachedContents('ads', letterheadParams, getArticleAds)) || [];
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
      monkeypodLink,
      site,
    },
  };
}
