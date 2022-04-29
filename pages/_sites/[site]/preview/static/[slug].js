import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  generateAllStaticPagePaths,
  hasuraGetPagePreview,
} from '../../../../../lib/pages.js';
import StaticPage from '../../../../../components/StaticPage';

export default function Static({ page, sections, siteMetadata }) {
  const router = useRouter();
  // const isAmp = useAmp();
  const isAmp = false;

  useEffect(() => {
    if (!page || page === undefined || page === null || page === {}) {
      router.push('/404');
    }
  }, [page, router]);

  if (router.isFallback) {
    return <div>Loading...</div>;
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
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const paths = await generateAllStaticPagePaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: {},
    preview: true,
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  let preview = context.preview;
  let params = context.params;

  if (!preview) {
    return {
      notFound: true,
    };
  }
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPagePreview({
    url: apiUrl,
    orgSlug: apiToken,
    slug: params.slug,
  });

  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    if (!data.page_slug_versions || !data.page_slug_versions[0]) {
      console.error('not found: data.page_slug_versions');
      return {
        notFound: true,
      };
    }
    page = data.page_slug_versions[0].page;

    sections = data.categories;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
    for (i = 0; i < sections.length; i++) {
      if (
        sections[i] &&
        sections[i].category_translations &&
        sections[i].category_translations[0] &&
        sections[i].category_translations[0].title
      ) {
        sections[i].title = sections[i].category_translations[0].title;
      }
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
