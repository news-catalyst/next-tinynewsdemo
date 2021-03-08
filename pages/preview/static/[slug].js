import { useRouter } from 'next/router';
import { useAmp } from 'next/amp';
import React, { useEffect } from 'react';
import {
  hasuraGetPagePreview,
  hasuraListAllPageSlugsPreview,
} from '../../../lib/articles.js';
import { hasuraLocaliseText } from '../../../lib/utils';
import Layout from '../../../components/Layout';
import { renderBody } from '../../../lib/utils.js';

export default function StaticPage({ page, sections, siteMetadata }) {
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

  let localisedPage;
  let body;
  if (page) {
    // there will only be one translation returned for a given page + locale
    localisedPage = page.page_translations[0];
    body = renderBody(page.page_translations, isAmp);
  }

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <div className="post">
        <article className="container">
          <section key="title" className="section post__header">
            <div className="section__container">
              <div className="post__title">{localisedPage.headline}</div>
            </div>
          </section>
          <section className="section post__body rich-text" key="body">
            <div id="articleText" className="section__container">
              <div className="post-text">
                <div>{body}</div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </Layout>
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
          slug: '/static/' + page.slug,
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
