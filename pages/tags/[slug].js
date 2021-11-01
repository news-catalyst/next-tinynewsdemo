import { useRouter } from 'next/router';
import Layout from '../../components/Layout.js';
import { hasuraTagPage, hasuraListAllTags } from '../../lib/articles.js';
import { cachedContents } from '../../lib/cached';
import { getArticleAds } from '../../lib/ads.js';
import { hasuraLocalizeText } from '../../lib/utils.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';
import ReadInOtherLanguage from '../../components/articles/ReadInOtherLanguage';
import {
  SectionContainer,
  SectionLayout,
  Block,
} from '../../components/common/CommonStyles';

export default function TagPage({
  articles,
  tag,
  sections,
  siteMetadata,
  expandedAds,
  locale,
  locales,
}) {
  const router = useRouter();
  const isAmp = useAmp();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  let tagTitle = hasuraLocalizeText(locale, tag.tag_translations, 'title');

  // set page title
  siteMetadata['homepageTitle'] = tagTitle + ' | ' + siteMetadata['shortName'];

  return (
    <Layout locale={locale} meta={siteMetadata} sections={sections}>
      <ArticleStream
        articles={articles}
        sections={sections}
        showCategory={true}
        isAmp={isAmp}
        title={`Articles tagged with ${tagTitle}`}
        metadata={siteMetadata}
        ads={expandedAds}
        locale={locale}
      />
      {locales.length > 1 && (
        <SectionLayout>
          <SectionContainer>
            <Block>
              <ReadInOtherLanguage locales={locales} currentLocale={locale} />
            </Block>
          </SectionContainer>
        </SectionLayout>
      )}
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let paths = [];
  const { errors, data } = await hasuraListAllTags({
    url: apiUrl,
    orgSlug: apiToken,
  });

  if (errors || !data) {
    return {
      paths,
      fallback: true,
    };
  }
  for (const tag of data.tags) {
    for (const locale of tag.tag_translations) {
      paths.push({
        params: {
          slug: tag.slug,
        },
        locale: locale.code,
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

  let articles = [];
  let sections = [];
  let locales = [];
  let tag;
  let siteMetadata;

  const { errors, data } = await hasuraTagPage({
    url: apiUrl,
    orgSlug: apiToken,
    tagSlug: params.slug,
  });

  if (errors || !data) {
    return {
      notFound: true,
    };
  } else {
    tag = data.tags[0];

    if (!tag || tag === undefined) {
      return {
        notFound: true,
      };
    }

    tag.tag_articles.map((tag_article) => {
      articles.push(tag_article.article);
    });

    sections = data.categories;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocalizeText(
        locale,
        sections[i].category_translations,
        'title'
      );
    }

    locales = data.organization_locales;

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error('failed finding site metadata for ', locale, metadatas);
    }
  }

  let expandedAds = [];
  if (process.env.LETTERHEAD_API_URL) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => ad.adTypeId === 166 && ad.status === 4);
  }

  return {
    props: {
      articles,
      tag,
      sections,
      siteMetadata,
      expandedAds,
      locale,
      locales,
    },
  };
}
