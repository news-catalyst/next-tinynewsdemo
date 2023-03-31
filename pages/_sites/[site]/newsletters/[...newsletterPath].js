import { useRouter } from 'next/router';
import React from 'react';
import tw from 'twin.macro';
import Layout from '../../../../components/Layout.js';
import { cachedContents } from '../../../../lib/cached';
import {
  hasuraGetNewslettersForSlug,
  listNewsletterPagePaths,
} from '../../../../lib/newsletters.js';
import {
  booleanSetting,
  findSetting,
  getOrgSettings,
} from '../../../../lib/settings.js';
import { getArticleAds } from '../../../../lib/ads.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  NewsletterPostText,
} from '../../../../components/common/CommonStyles.js';
import PublishDate from '../../../../components/articles/PublishDate.js';
import ArticleFooter from '../../../../components/articles/ArticleFooter';
import NewsletterBlock from '../../../../components/plugins/NewsletterBlock';
import LetterheadNewsletter from '../../../../components/nodes/embeds/LetterheadNewsletter';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;
const BlockWrapper = tw.div`w-full`;

export default function NewsletterEditionPage(props) {
  // const isAmp = useAmp();
  const isAmp = false;
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // let body;

  // if (props.newsletter) {
  //   body = renderNewsletterContent(
  //     props.newsletter.content,
  //     [],
  //     isAmp,
  //     props.siteMetadata
  //   );
  // }

  return (
    <Layout
      meta={props.siteMetadata}
      sections={props.sections}
      renderFooter={props.renderFooter}
      site={props.site}
      bannerAds={props.bannerAds}
    >
      <SectionContainer>
        <NewsletterPostText>
          <ArticleTitle meta={props.siteMetadata}>
            {props.newsletter.headline}
          </ArticleTitle>
          <PublishDate article={props.newsletter} meta={props.siteMetadata} />
          <LetterheadNewsletter content={props.newsletter.content} />
          <ArticleFooter
            article={props.newsletter}
            isAmp={isAmp}
            metadata={props.siteMetadata}
          />
          <NewsletterBlock metadata={props.siteMetadata} site={props.site} />
        </NewsletterPostText>
      </SectionContainer>
    </Layout>
  );
}

function extractNewsletterPathInfo(orgData) {
  const { newsletter_editions: newsletters = [], subdomain, customDomain } =
    orgData || {};
  return newsletters
    .filter((newsletter) => newsletter.slug !== undefined)
    .map(({ slug, letterhead_id }) => {
      const site = subdomain || customDomain;
      const newsletterPath = [slug];
      if (letterhead_id) {
        newsletterPath.push(String(letterhead_id));
      }
      return {
        params: {
          site,
          newsletterPath,
        },
      };
    });
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;
  const { errors, data } = await listNewsletterPagePaths({
    url: apiUrl,
    adminSecret,
  });
  if (errors) {
    console.error('listNewsletterPagePaths errors:', errors);
    throw errors;
  }
  if (!data || !Array.isArray(data.organizations)) {
    const errorDescription =
      'listNewsletterPagePaths error: invalid data object returned';
    console.error(errorDescription);
    throw new Error(errorDescription);
  }

  const paths = data.organizations
    .map(extractNewsletterPathInfo)
    .reduce((allPaths, orgPaths) => [...allPaths, ...orgPaths], []);

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;
  const locale = 'en-US';
  let {
    newsletterPath: [slug, letterheadId],
  } = params;
  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    throw settingsResult.errors;
  }

  let settings = settingsResult.data.settings;

  let newsletter;
  let sections = [];
  let tags = [];
  let siteMetadata;

  const { errors, data } = await hasuraGetNewslettersForSlug({
    url: apiUrl,
    site: site,
    slug: slug,
    localeCode: 'en-US',
  });

  if (
    errors ||
    !data ||
    !Array.isArray(data.newsletter_editions) ||
    data.newsletter_editions.length < 1
  ) {
    console.error('error getting newsletter:', errors || 'empty result');
    return {
      notFound: true,
    };
  } else {
    if (letterheadId) {
      newsletter = data.newsletter_editions.find(
        (edition) => String(edition.letterhead_id) === letterheadId
      );
    } else {
      // if we do not get a letterHeadId we can return the first value found
      newsletter = data.newsletter_editions[0];
    }
    // If newsletter is undefined here, we have an error.
    if (!newsletter) {
      console.error(
        `error getting newsletter: valid newsletter not found within results`
      );
      return {
        notFound: true,
      };
    }
    sections = data.categories;
    tags = data.tags;

    for (var i = 0; i < sections.length; i++) {
      if (
        sections[i] &&
        sections[i].category_translations &&
        sections[i].category_translations[0] &&
        sections[i].category_translations[0].title
      ) {
        sections[i].title = sections[i].category_translations[0].title;
      }
    }

    for (var j = 0; j < tags.length; j++) {
      if (tags[j]?.tag_translations[0]?.title) {
        tags[j].title = tags[j]?.tag_translations[0]?.title;
      } else {
        tags.splice(j, 1);
      }
    }
    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error('failed finding site metadata for ', locale, metadatas);
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

  let renderFooter = booleanSetting(settings, 'RENDER_FOOTER', true);
  console.log(`PROPS site: ${site}`);
  return {
    props: {
      newsletter,
      tags,
      sections,
      siteMetadata,
      renderFooter,
      site,
      bannerAds,
    },
  };
}
