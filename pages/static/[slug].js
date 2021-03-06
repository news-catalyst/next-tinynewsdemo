import { useRouter } from 'next/router';
import { useAmp } from 'next/amp';
import React from 'react';
import { hasuraGetPage, hasuraListAllPageSlugs } from '../../lib/articles.js';
import { hasuraLocaliseText } from '../../lib/utils';
import StaticPage from '../../components/StaticPage';

export default function Static({ page, sections, siteMetadata }) {
  const router = useRouter();
  const isAmp = useAmp();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!page || page === undefined || page === null || page === {}) {
    router.push('/404');
  }

  return (
    <StaticPage
      isAmp={isAmp}
      page={page}
      sections={sections}
      siteMetadata={siteMetadata}
    />
  );
}

export async function getStaticPaths() {
  const { errors, data } = await hasuraListAllPageSlugs();
  if (errors) {
    throw errors;
  }

  let paths = [];
  for (const page of data.pages) {
    for (const locale of page.page_translations) {
      paths.push({
        params: {
          slug: page.slug,
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

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: params.slug,
    localeCode: locale,
  });

  if (errors || !data) {
    console.log('Failed finding page ', params);

    return {
      notFound: true,
    };
  } else {
    if (!data.page_slug_versions || !data.page_slug_versions[0]) {
      console.log('No page slug versions found', data);
      return {
        notFound: true,
      };
    }

    page = data.page_slug_versions[0].page;
    sections = data.categories;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
    }
  }

  return {
    props: {
      page,
      sections,
      siteMetadata,
    },
  };
}
