import DefaultErrorPage from 'next/error';
import {
  hasuraListAllArticleSlugs,
  hasuraPreviewArticlePage,
} from '../../../lib/articles.js';
import { hasuraLocaliseText } from '../../../lib/utils.js';
import { getArticleAds } from '../../../lib/ads.js';
import { cachedContents } from '../../../lib/cached';
import Article from '../../../components/Article.js';

export default function PreviewArticle(props) {
  if (!props.article) {
    console.log('no article prop: ', props);
    return (
      <div>
        <DefaultErrorPage statusCode={404} />
      </div>
    );
  }

  return <Article {...props} />;
}

export async function getStaticPaths() {
  const { errors, data } = await hasuraListAllArticleSlugs();
  if (errors) {
    throw errors;
  }

  let paths = [];
  for (const article of data.articles) {
    for (const locale of article.article_translations) {
      paths.push({
        params: {
          category: article.category.slug,
          slug: article.slug,
        },
        locale: locale.locale_code,
      });
    }
  }
  return {
    paths,
    fallback: false,
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

  let article = {};
  let sectionArticles = [];
  let sections = [];
  let tags = [];
  let siteMetadata;

  const { errors, data } = await hasuraPreviewArticlePage({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
    slug: params.slug,
    categorySlug: params.category,
  });
  if (errors || !data) {
    console.log('error getting article page:', errors);
    return {
      notFound: true,
    };
  } else {
    tags = data.tags;
    for (var i = 0; i < tags.length; i++) {
      tags[i].title = hasuraLocaliseText(tags[i].tag_translations, 'title');
    }
    sections = data.categories;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
    }

    article = data.articles.find((a) => a.slug === params.slug);
    if (article && article.article_translations.length > 1) {
      // let mostRecentContent = article.article_translations.map(function(e) { return e.updated_at; }).sort().reverse()[0]
      console.log(
        'found more than 1 translation: ',
        article.article_translations
      );
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
      console.log('failed finding site metadata for ', locale, metadatas);
    }
  }

  let ads = [];
  if (process.env.LETTERHEAD_API_URL) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    ads = allAds.filter((ad) => ad.adTypeId === 164);
  }

  return {
    props: {
      article,
      sections,
      ads,
      siteMetadata,
      sectionArticles,
      tags,
    },
  };
}
