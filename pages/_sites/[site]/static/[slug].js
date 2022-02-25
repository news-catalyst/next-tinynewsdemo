import { useRouter } from 'next/router';
import React from 'react';
import {
  hasuraGetPage,
  generateAllStaticPagePaths,
} from '../../../../lib/articles.js';
import { hasuraLocalizeText } from '../../../../lib/utils';
import StaticPage from '../../../../components/StaticPage';

export default function Static({ page, sections, siteMetadata }) {
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
      console.error('No page slug versions found', data);
      return {
        notFound: true,
      };
    }

    page = data.page_slug_versions[0].page;
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
    },
    revalidate: 1,
  };
}
