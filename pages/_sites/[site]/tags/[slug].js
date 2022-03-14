import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout.js';
import {
  hasuraTagPage,
  generateAllTagPagePaths,
} from '../../../../lib/articles.js';
import { cachedContents } from '../../../../lib/cached';
import { getArticleAds } from '../../../../lib/ads.js';
import ArticleStream from '../../../../components/homepage/ArticleStream';

export default function TagPage({
  articles,
  tag,
  sections,
  siteMetadata,
  expandedAds,
}) {
  const router = useRouter();
  const isAmp = false;

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  let tagTitle = tag.tag_translations[0].title;

  // set page title
  siteMetadata['homepageTitle'] = tagTitle + ' | ' + siteMetadata['shortName'];

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <ArticleStream
        articles={articles}
        sections={sections}
        showCategory={true}
        isAmp={isAmp}
        title={`Articles tagged with ${tagTitle}`}
        metadata={siteMetadata}
        ads={expandedAds}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const paths = await generateAllTagPagePaths({
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

  let articles = [];
  let sections = [];
  let tag;
  let siteMetadata;

  const { errors, data } = await hasuraTagPage({
    url: apiUrl,
    site: site,
    tagSlug: params.slug,
    localeCode: 'en-US',
  });

  if (errors || !data) {
    console.error('errors', errors);
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
      sections[i].title = sections[i].category_translations[0].title;
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error('failed finding site metadata', metadatas);
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
    },
  };
}
