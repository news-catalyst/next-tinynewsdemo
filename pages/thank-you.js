import React, { useEffect } from 'react';
import { useAmp } from 'next/amp';
import { hasuraGetPage } from '../lib/articles.js';
import { useAnalytics } from '../lib/hooks/useAnalytics.js';
import { hasuraLocaliseText } from '../lib/utils';
import Layout from '../components/Layout';
import NewsletterBlock from '../components/plugins/NewsletterBlock';
import { renderBody } from '../lib/utils.js';

export default function ThankYou({ referrer, page, sections, siteMetadata }) {
  const isAmp = useAmp();

  useEffect(() => {
    // sets a cookie if request comes from monkeypod.io marking this browser as a donor
    const { checkReferrer, trackEvent } = useAnalytics();
    // this will return true if the request came from monkeypod, false otherwise
    let isDonor = checkReferrer(referrer);
    if (isDonor) {
      trackEvent({
        action: 'submit',
        category: 'NTG membership',
        label: 'success',
        non_interaction: false,
      });
    }
  }, []);

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(page.page_translations, isAmp);

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <div className="post">
        <section key="title" className="section post__header">
          <div className="section__container">
            <div className="post__title">{localisedPage.headline}</div>
            <div className="post__dek">{body}</div>
            <section className="section post__body rich-text" key="body">
              <NewsletterBlock
                metadata={siteMetadata}
                headline={localisedPage.headline}
                wrap={false}
              />
            </section>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const referrer = context.req.headers['referer'];
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: 'thank-you',
    localeCode: context.locale,
  });
  if (
    errors ||
    !data ||
    !data.pages ||
    data.pages.length <= 0 ||
    !data.pages[0]
  ) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    sections = data.categories;
    page = data.pages[0];
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
      referrer: referrer || '',
      page,
      sections,
      siteMetadata,
    },
  };
}
