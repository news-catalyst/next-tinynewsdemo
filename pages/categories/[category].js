import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Layout from '../../components/Layout.js';
import { cachedContents } from '../../lib/cached';
import {
  hasuraCategoryPage,
  hasuraListAllSections,
} from '../../lib/articles.js';
import { getArticleAds } from '../../lib/ads.js';
import { hasuraLocaliseText } from '../../lib/utils.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';
import ReadInOtherLanguage from '../../components/articles/ReadInOtherLanguage';
import {
  SectionContainer,
  SectionLayout,
  Block,
} from '../../components/common/CommonStyles';

export default function CategoryPage(props) {
  const isAmp = useAmp();

  const router = useRouter();

  useEffect(() => {
    if (props.categoryExists === false) {
      router.push('/404');
    }
  }, [props.categoryExists, router]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  let siteMetadata = props.siteMetadata;
  // set page title
  siteMetadata['homepageTitle'] =
    props.title + ' | ' + siteMetadata['shortName'];

  return (
    <Layout
      meta={siteMetadata}
      sections={props.sections}
      renderFooter={props.renderFooter}
    >
      <ArticleStream
        articles={props.articles}
        sections={props.sections}
        showCategory={false}
        isAmp={isAmp}
        title={props.title}
        metadata={props.siteMetadata}
        ads={props.expandedAds}
      />

      <SectionLayout>
        <SectionContainer>
          <Block>
            <ReadInOtherLanguage
              locales={props.locales}
              currentLocale={props.locale}
            />
          </Block>
        </SectionContainer>
      </SectionLayout>
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let paths = [];
  const { errors, data } = await hasuraListAllSections({
    url: apiUrl,
    orgSlug: apiToken,
  });

  if (errors || !data) {
    return {
      paths,
      fallback: true,
    };
  }

  const siteLocales = process.env.LOCALES.split(',');

  for (const section of data.categories) {
    for (const locale of section.category_translations) {
      if (siteLocales.indexOf(locale) >= 0) {
        paths.push({
          params: {
            category: section.slug,
          },
          locale: locale.locale_code,
        });
      }
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
  let tags = [];
  let locales = [];
  let siteMetadata;
  let title;
  let categoryExists = false;

  const { errors, data } = await hasuraCategoryPage({
    url: apiUrl,
    orgSlug: apiToken,
    categorySlug: params.category,
    localeCode: locale,
  });

  if (errors || !data) {
    console.log('error listing articles:', errors);
    return {
      notFound: true,
    };
  } else {
    articles = data.articles;
    sections = data.categories;
    locales = data.organization_locales;

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
      if (sections[i].slug == params.category) {
        categoryExists = true;
        title = hasuraLocaliseText(sections[i].category_translations, 'title');
      }
    }

    for (var j = 0; j < tags.length; j++) {
      tags[j].title = hasuraLocaliseText(tags[j].tag_translations, 'title');
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.log('failed finding site metadata for ', locale, metadatas);
    }
  }

  if (!title) {
    title = params.category;
  }

  let expandedAds = [];
  if (process.env.LETTERHEAD_API_URL) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => ad.adTypeId === 166 && ad.status === 4);
  }

  let renderFooter = true;
  if (process.env.ORG_SLUG === 'tiny-news-curriculum') {
    renderFooter = false; // turns off the global footer for the curriculum site
  }

  return {
    props: {
      articles,
      categoryExists,
      tags,
      title,
      sections,
      siteMetadata,
      expandedAds,
      renderFooter,
      locale,
      locales,
    },
  };
}
