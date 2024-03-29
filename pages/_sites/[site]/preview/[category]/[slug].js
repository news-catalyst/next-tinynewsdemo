import DefaultErrorPage from 'next/error';
import {
  hasuraPreviewArticlePage,
  generateAllArticlePreviewPagePaths,
} from '../../../../../lib/articles.js';
import { getArticleAds } from '../../../../../lib/ads.js';
import { cachedContents } from '../../../../../lib/cached';
import Article from '../../../../../components/Article.js';
import {
  booleanSetting,
  findSetting,
  getOrgSettings,
} from '../../../../../lib/settings.js';

export default function PreviewArticle(props) {
  if (!props.article) {
    return (
      <div>
        <DefaultErrorPage statusCode={404} />
      </div>
    );
  }
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
  const locale = 'en-US';
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;
  const preview = context.preview;
  const params = context.params;

  if (!preview) {
    return {
      notFound: true,
    };
  }

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    throw settingsResult.errors;
  }
  const settings = settingsResult.data.settings;

  let article = {};
  let sectionArticles = [];
  let sections = [];
  let tags = [];
  let siteMetadata;

  const { errors, data } = await hasuraPreviewArticlePage({
    url: apiUrl,
    site: site,
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
    tags = data.tags;
    for (var i = 0; i < tags.length; i++) {
      tags[i].title = tags[i].tag_translations[0].title;
    }

    sections = data.categories;
    for (var j = 0; j < sections.length; j++) {
      sections[j].title = sections[j].category_translations[0].title;
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
      console.error('preview failed finding site metadata for ', metadatas);
    }
  }

  let ads = [];
  let letterheadSetting = booleanSetting(settings, 'LETTERHEAD_API_URL', false);
  if (letterheadSetting) {
    let letterheadParams = {
      url: findSetting(settings, 'LETTERHEAD_API_URL'),
      apiKey: findSetting(settings, 'LETTERHEAD_API_KEY'),
    };
    const allAds =
      (await cachedContents('ads', letterheadParams, getArticleAds)) || [];
    ads = allAds.filter((ad) => ad.adTypeId === 164 && ad.status === 4);
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
