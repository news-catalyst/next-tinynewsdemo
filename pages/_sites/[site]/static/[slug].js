import { useRouter } from 'next/router';
import React from 'react';
import {
  hasuraGetPage,
  generateAllStaticPagePaths,
} from '../../../../lib/articles.js';
import { hasuraLocalizeText } from '../../../../lib/utils';
import StaticPage from '../../../../components/StaticPage';

export default function Static({
  page,
  sections,
  siteMetadata,
  locales,
  locale,
  settings,
}) {
  const router = useRouter();
  const isAmp = false;

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
        locales={locales}
        currentLocale={locale}
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

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
  });

  if (settingsResult.errors) {
    throw settingsResult.errors;
  }

  let settings = settingsResult.data.settings;

  let page = {};
  let sections;
  let locales = [];
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
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
      console.error('No page slug versions found', data);
      return {
        notFound: true,
      };
    }

    page = data.page_slug_versions[0].page;
    var allPageLocales = data.pages[0].page_translations;
    var distinctLocaleCodes = [];
    var distinctLocales = [];
    for (var i = 0; i < allPageLocales.length; i++) {
      if (!distinctLocaleCodes.includes(allPageLocales[i].locale.code)) {
        distinctLocaleCodes.push(allPageLocales[i].locale.code);
        distinctLocales.push(allPageLocales[i]);
      }
    }
    locales = distinctLocales;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;

    sections = data.categories;
    for (var j = 0; j < sections.length; j++) {
      sections[j].title = hasuraLocalizeText(
        locale,
        sections[j].category_translations,
        'title'
      );
    }
  }

  return {
    props: {
      page,
      sections,
      siteMetadata,
      locales,
      locale,
      settings,
    },
    revalidate: 1,
  };
}
