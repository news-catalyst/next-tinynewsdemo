import { useRouter } from 'next/router';
import Layout from '../components/Layout.js';
import { cachedContents } from '../lib/cached';
import {
  hasuraListAllArticlesBySection,
  hasuraListAllSections,
} from '../lib/articles.js';
import { getArticleAds } from '../lib/ads.js';
import { hasuraLocaliseText } from '../lib/utils.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../components/homepage/ArticleStream';

export default function CategoryPage(props) {
  const isAmp = useAmp();

  const router = useRouter();
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout
      meta={props.siteMetadata}
      sections={props.sections}
      locale={props.locale}
    >
      <ArticleStream
        articles={props.articles}
        sections={props.sections}
        showCategory={false}
        isAmp={isAmp}
        title={props.title}
        locale={props.locale}
        metadata={props.siteMetadata}
        ads={props.expandedAds}
      />
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let paths = [];
  let sections = [];
  const { errors, data } = await hasuraListAllSections({
    url: apiUrl,
    orgSlug: apiToken,
  });

  if (errors || !data) {
    return {
      paths,
      fallback: true,
    };
  } else {
    sections = data.categories;
  }

  for (const locale of locales) {
    sections.map((section) => {
      paths.push({
        params: {
          category: section.slug,
        },
        locale,
      });
    });
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
  let siteMetadata;
  let title;

  const { errors, data } = await hasuraListAllArticlesBySection({
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
    tags = data.tags;

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
      if (sections[i].slug == params.category) {
        title = hasuraLocaliseText(sections[i].category_translations, 'title');
        if (title) {
          break;
        }
      }
    }

    for (var i = 0; i < tags.length; i++) {
      tags[i].title = hasuraLocaliseText(tags[i].tag_translations, 'title');
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

  const allAds = await cachedContents('ads', getArticleAds);
  const expandedAds = allAds.filter((ad) => ad.adTypeId === 166);

  return {
    props: {
      articles,
      locale,
      tags,
      title,
      sections,
      siteMetadata,
      expandedAds,
    },
  };
}
