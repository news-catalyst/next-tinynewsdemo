import { useRouter } from 'next/router';
import React from 'react';
import {
  generateAllStaticPagePaths,
  hasuraGetPage,
} from '../../../../lib/pages.js';
import StaticPage from '../../../../components/StaticPage';
import { NextSeo } from 'next-seo';
import TwitterMeta from '../../../../components/TwitterMeta';
import {
  booleanSetting,
  findSetting,
  getOrgSettings,
  generateAllDomainPaths,
} from '../../../../lib/settings';
import { cachedContents } from '../../../../lib/cached';
import { getArticleAds } from '../../../../lib/ads.js';

export default function Static({
  page,
  sections,
  siteMetadata,
  site,
  bannerAds,
  monkeypodLink,
}) {
  const router = useRouter();
  const isAmp = false;
  let pages = page?.page_translations[0];

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!page || page === undefined || page === null || page === {}) {
    router.push('/404');
  }

  return (
    <>
      <StaticPage
        isAmp={isAmp}
        page={page}
        sections={sections}
        siteMetadata={siteMetadata}
        site={site}
        bannerAds={bannerAds}
        monkeypodLink={monkeypodLink}
      />

      <NextSeo
        title={pages.headline}
        description={pages.search_description}
        canonical={`${siteMetadata.siteUrl}/static/${page.slug}`}
        openGraph={{
          title: `${pages.facebook_title || pages.headline}`,
          description: pages.facebook_description || pages.search_description,
          url: `${siteMetadata.siteUrl}/static/${page.slug}`,
          images: [
            {
              url: siteMetadata.defaultSocialImageWidth,
              width: siteMetadata.defaultSocialImageWidth,
              height: siteMetadata.defaultSocialImageHeight,
            },
          ],
        }}
      />
      <TwitterMeta
        override={{
          title: pages.headline,
          description: pages.search_description,
        }}
        siteMetadata={siteMetadata}
      />
    </>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const paths = await generateAllStaticPagePaths({
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
    console.error('Settings lookup error:', settingsResult.errors);
    throw settingsResult.errors;
  }
  const settings = settingsResult.data.settings;
  const monkeypodLink = findSetting(settings, 'NEXT_PUBLIC_MONKEYPOD_URL');

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    site: site,
    slug: params.slug,
    localeCode: locale,
  });

  if (errors || !data) {
    console.error('Failed finding page ', params);

    return {
      notFound: true,
    };
  } else {
    if (!data.page_slug_versions || !data.page_slug_versions[0]) {
      console.error('No page slug versions found for:', params.slug);
      return {
        notFound: true,
      };
    }

    page = data.page_slug_versions[0].page;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;

    sections = data.categories;
    for (var j = 0; j < sections.length; j++) {
      sections[j].title = sections[j].category_translations[0].title;
    }
  }

  let bannerAds = [];
  let letterheadSetting = booleanSetting(settings, 'LETTERHEAD_API_URL', false);

  if (letterheadSetting) {
    let letterheadParams = {
      url: findSetting(settings, 'LETTERHEAD_API_URL'),
      apiKey: findSetting(settings, 'LETTERHEAD_API_KEY'),
    };
    const allAds =
      (await cachedContents('ads', letterheadParams, getArticleAds)) || [];

    bannerAds = allAds.filter((ad) => {
      return (
        parseInt(ad.adTypeId) === parseInt(siteMetadata.bannerAdID) &&
        ad.status === 4
      );
    });
  }

  return {
    props: {
      page,
      sections,
      siteMetadata,
      site,
      bannerAds,
      monkeypodLink,
    },
    revalidate: 1,
  };
}
