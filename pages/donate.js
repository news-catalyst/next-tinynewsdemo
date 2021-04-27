import { useAmp } from 'next/amp';
import tw from 'twin.macro';
import { hasuraGetPage } from '../lib/articles.js';
import { hasuraLocaliseText } from '../lib/utils';
import Layout from '../components/Layout';
import { renderBody } from '../lib/utils.js';
import DonationOptionsBlock from '../components/plugins/DonationOptionsBlock.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from '../components/common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function Donate({ page, sections, siteMetadata }) {
  const isAmp = useAmp();

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(page.page_translations, isAmp);

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <SectionContainer>
        <article className="container">
          <ArticleTitle meta={siteMetadata} tw="text-center">
            {localisedPage.headline}
          </ArticleTitle>
          <PostText>
            <PostTextContainer>{body}</PostTextContainer>
          </PostText>
          <DonationOptionsBlock metadata={siteMetadata} wrap={true} />
        </article>
      </SectionContainer>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: 'donate',
    localeCode: locale,
  });
  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    if (!data.page_slug_versions || !data.page_slug_versions[0]) {
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
