import { useRouter } from 'next/router';
import { useAmp } from 'next/amp';
import React, { useEffect } from 'react';
import {
  hasuraGetPagePreview,
  hasuraListAllPageSlugsPreview,
} from '../../../lib/articles.js';
import { hasuraLocaliseText } from '../../../lib/utils';
import StaticPage from '../../components/StaticPage';

export default function Static({ page, sections, siteMetadata }) {
  const router = useRouter();
  const isAmp = useAmp();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (!page || page === undefined || page === null || page === {}) {
      router.push('/404');
    }
  }, [page]);

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
  const { errors, data } = await hasuraListAllPageSlugsPreview();
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

export async function getStaticProps(context) {
  let locale = context.locale;
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
    localeCode: locale,
  });

  if (errors || !data) {
    console.log('Failed finding page ', params);

    return {
      notFound: true,
    };
  } else {
    if (!data.pages || !data.pages[0]) {
      return {
        notFound: true,
      };
    }
    page = data.pages[0];
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
