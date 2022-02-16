import DefaultErrorPage from 'next/error';
import {
  hasuraPreviewArticlePage,
  generateAllArticlePreviewPagePaths,
} from '../../../../../lib/articles.js';
import { hasuraLocalizeText } from '../../../../../lib/utils.js';
import { getArticleAds } from '../../../../../lib/ads.js';
import { cachedContents } from '../../../../../lib/cached';
import Article from '../../../../../components/Article.js';

export default function PreviewArticle(props) {
  if (!props.article) {
    // console.log('no props.article, returning notFound');
    return (
      <div>
        <DefaultErrorPage statusCode={404} />
      </div>
    );
  }
  // console.log('returning article component...');
  return <Article {...props} />;
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;
  const paths = await generateAllArticlePreviewPagePaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: {},
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  let locale = context.locale;
  let preview = context.preview;
  let params = context.params;
  // console.log(context);
  if (!preview) {
    // console.log('no preview, returning notFound');
    return {
      notFound: true,
    };
  }

  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let article = {};
  let sectionArticles = [];
  let sections = [];
  let tags = [];
  let locales = [];
  let publishedLocales = [];
  let siteMetadata;

  const { errors, data } = await hasuraPreviewArticlePage({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
    slug: params.slug,
    categorySlug: params.category,
  });
  if (errors || !data) {
    console.error('error getting preview article page:', errors);
    return {
      notFound: true,
    };
  } else {
    locales = data.organization_locales;
    publishedLocales = data.published_article_translations;

    tags = data.tags;
    for (var i = 0; i < tags.length; i++) {
      tags[i].title = hasuraLocalizeText(
        locale,
        tags[i].tag_translations,
        'title'
      );
    }

    sections = data.categories;
    for (var j = 0; j < sections.length; j++) {
      sections[j].title = hasuraLocalizeText(
        locale,
        sections[j].category_translations,
        'title'
      );
    }

    article = data.articles.find((a) => a.slug === params.slug);
    if (article && article.article_translations.length > 1) {
      // let mostRecentContent = article.article_translations.map(function(e) { return e.updated_at; }).sort().reverse()[0]
      // console.log(
      //   'found more than 1 translation: ',
      //   article.article_translations
      // );
      let mostRecentContents = article.article_translations.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      let mostRecentContent = mostRecentContents[0];

      article.article_translations = [mostRecentContent];
    }
    sectionArticles = data.articles.filter((a) => a.slug !== params.slug);

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error(
        'preview failed finding site metadata for ',
        locale,
        metadatas
      );
    }
  }

  let ads = [];
  if (process.env.LETTERHEAD_API_URL) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    ads = allAds.filter((ad) => ad.adTypeId === 164 && ad.status === 4);
  }

  return {
    props: {
      article,
      sections,
      ads,
      locales,
      publishedLocales,
      siteMetadata,
      sectionArticles,
      tags,
    },
  };
}
