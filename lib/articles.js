import { GraphQLClient } from 'graphql-request';
import { localiseText } from './utils';
import { fetchGraphQL } from './utils';
const gql = require('./graphql/queries');

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const HASURA_LIST_ORG_LOCALES = `query MyQuery {
  organization_locales {
    locale {
      code
    }
  }
}`;
export function hasuraListLocales(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_ORG_LOCALES,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
      slug: params['slug'],
    },
  });
}

const HASURA_SEARCH_ARTICLES = `query MyQuery($locale_code: String!, $term: String!) {
  articles(where: {article_translations: {headline: {_ilike: $term}, locale_code: {_eq: $locale_code}, published: {_eq: true}}}) {
    id
    article_translations(where: {locale_code: {_eq: $locale_code}, published: {_eq: true}}) {
      content
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      search_description
      search_title
      twitter_description
      twitter_title
      updated_at
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
      }
    }
    slug
    author_articles {
      author {
        name
        photoUrl
        slug
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
    }
    tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
      tag {
        tag_translations {
          title
        }
        slug
      }
    }
  }
}`;

const HASURA_HOMEPAGE_EDITOR = `query MyQuery($locale_code: String) {
  homepage_layout_schemas {
    id
    name
    data
  }
  homepage_layout_datas {
    first_article {
      id
      article_translations(where: {locale_code: {_eq: $locale_code}}) {
        content
        custom_byline
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        search_description
        search_title
        twitter_description
        twitter_title
        updated_at
      }
      category {
        slug
        id
        category_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
      slug
      author_articles {
        author {
          name
          photoUrl
          slug
          author_translations(where: {locale_code: {_eq: $locale_code}}) {
            title
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
        tag {
          tag_translations {
            title
          }
          slug
        }
      }
    }
    homepage_layout_schema {
      id
      name
      data
    }
    second_article {
      id
      article_translations(where: {locale_code: {_eq: $locale_code}}) {
        content
        custom_byline
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        search_description
        search_title
        twitter_description
        twitter_title
        updated_at
      }
      category {
        slug
        id
        category_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
      slug
      author_articles {
        author {
          name
          photoUrl
          slug
          author_translations(where: {locale_code: {_eq: $locale_code}}) {
            title
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
        tag {
          tag_translations {
            title
          }
          slug
        }
      }
    }
    third_article {
      id
      article_translations(where: {locale_code: {_eq: $locale_code}}) {
        content
        custom_byline
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        search_description
        search_title
        twitter_description
        twitter_title
        updated_at
      }
      category {
        slug
        id
        category_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
      slug
      author_articles {
        author {
          name
          photoUrl
          slug
          author_translations(where: {locale_code: {_eq: $locale_code}}) {
            title
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
        tag {
          tag_translations {
            title
          }
          slug
        }
      }
    }
  }
  categories(where: {published: {_eq: true}}) {
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
    slug
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
  tags(where: {published: {_eq: true}}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
  }
}`;

const HASURA_UPSERT_HOMEPAGE = `mutation upsert_homepage_layout_data($homepage_layout_schema_id: Int!, $article_priority_1: Int, $article_priority_2: Int, $article_priority_3: Int) {
  insert_homepage_layout_datas(objects: [{article_priority_1: $article_priority_1, article_priority_2: $article_priority_2, article_priority_3: $article_priority_3, homepage_layout_schema_id: $homepage_layout_schema_id}], on_conflict: {constraint: homepage_layout_datas_organization_id_key, update_columns: [article_priority_1, article_priority_2, article_priority_3, homepage_layout_schema_id]}) {
    returning {
      id
      homepage_layout_schema_id
      article_priority_1
      article_priority_2
      article_priority_3
    }
  }
}`;

const HASURA_GET_HOMEPAGE_DATA = `query MyQuery {
  homepage_layout_datas {
    first_article {
      id
      slug
      category {
        slug
      }
    }
    homepage_layout_schema {
      name
      data
    }
    second_article {
      category {
        slug
      }
      slug
      id
    }
    third_article {
      id
      slug
      category {
        slug
      }
    }
  }
}`;

const HASURA_PREVIEW_ARTICLE_PAGE = `query MyQuery($category_slug: String!, $locale_code: String!) {
  articles(where: {article_translations: {locale_code: {_eq: $locale_code}}, category: {slug: {_eq: $category_slug}}}) {
    article_translations(where: {locale_code: {_eq: $locale_code}}) {
      content
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      search_description
      search_title
      twitter_description
      twitter_title
      updated_at
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
      }
    }
    slug
    author_articles {
      author {
        name
        photoUrl
        slug
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
    }
    tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
      tag {
        tag_translations {
          title
        }
        slug
      }
    }
  }
  categories(where: {published: {_eq: true}}) {
    category_translations(where:{locale_code:{_eq: $locale_code}}) {
      title
      locale_code
    }
    slug
  }
  tags(where: {published: {_eq: true}}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
}`;

const HASURA_ARTICLE_PAGE = `query MyQuery($category_slug: String!, $locale_code: String!) {
  articles(where: {article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}, category: {slug: {_eq: $category_slug}}}) {
    article_translations(where: {locale_code: {_eq: $locale_code}}) {
      content
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      search_description
      search_title
      twitter_description
      twitter_title
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
      }
    }
    slug
    author_articles {
      author {
        name
        photoUrl
        slug
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
    }
    tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
      tag {
        tag_translations {
          title
        }
        slug
      }
    }
  }
  categories(where: {published: {_eq: true}}) {
    category_translations(where:{locale_code:{_eq: $locale_code}}) {
      title
      locale_code
    }
    slug
  }
  tags(where: {published: {_eq: true}}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
}`;

const HASURA_GET_METADATA_BY_LOCALE = `query MyQuery($locale_code: String!) {
  organization_locales {
    locale {
      code
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}}) {
    id
    published
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
}`;

const HASURA_LIST_TAGS = `query MyQuery {
  organization_locales {
    locale {
      code
    }
  }
  tags(where: {published: {_eq: true}}) {
    id
    slug
    tag_translations {
      locale_code
      title
    }
  }
}`;

const HASURA_TAG_PAGE = `query MyQuery($locale_code: String, $tag_slug: String!) {
  categories(where: {published: {_eq: true}}) {
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
    slug
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
  tags(where: {slug: {_eq: $tag_slug}}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
    tag_articles(where: {article: {article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}}}) {
      article {
        article_translations(where: {locale_code: {_eq: $locale_code}}) {
          content
          custom_byline
          facebook_description
          facebook_title
          first_published_at
          headline
          last_published_at
          search_description
          search_title
          twitter_description
          twitter_title
        }
        category {
          slug
          id
          category_translations(where: {locale_code: {_eq: $locale_code}}) {
            title
          }
        }
        slug
        author_articles {
          author {
            name
            photoUrl
            slug
            author_translations(where: {locale_code: {_eq: $locale_code}}) {
              title
            }
          }
        }
      }
    }
  }
}`;

const HASURA_CATEGORY_PAGE = `query MyQuery($category_slug: String!, $locale_code: String!) {
  articles(order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}, where: {article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}, category: {slug: {_eq: $category_slug}}}) {
    article_translations {
      content
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      search_description
      search_title
      twitter_description
      twitter_title
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
      }
    }
    slug
    author_articles {
      author {
        name
        photoUrl
        slug
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
    }
  }
  categories(where: {published: {_eq: true}}) {
    category_translations {
      title
      locale_code
    }
    slug
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations {
      data
    }
  }
  tags(where: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    tag_translations {
      title
    }
  }
}`;

const HASURA_GET_PAGE = `query MyQuery($slug: String!, $locale_code: String!) {
  pages(where: {slug: {_eq: $slug}, page_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}}) {
    id
    author_pages {
      author {
        id
        name
        slug
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
    }
    page_translations(where: {locale_code: {_eq: $locale_code}}) {
      content
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      published
      search_description
      search_title
      twitter_description
      twitter_title
    }
    slug
  }
  categories(where: {published: {_eq: true}, category_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations {
      data
    }
  }
}`;

const HASURA_GET_ARTICLE_BY_SLUG = `query MyQuery($slug: String!, $locale_code: String!) {
  articles(where: {slug: {_eq: $slug}, article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}}) {
    slug
    article_translations(where: {locale_code: {_eq: $locale_code}, published: {_eq: true}}) {
      content
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      search_description
      search_title
      twitter_description
      twitter_title
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
      }
    }
    author_articles {
      author {
        name
        photoUrl
        slug
        twitter
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          bio
          title
        }
      }
    }
  }
}`;

const HASURA_AUTHOR_PAGE = `query MyQuery($locale_code: String!, $author_slug: String!) {
  articles(order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}, where: {article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}, author_articles: {author: {slug: {_eq: $author_slug}}}}) {
    article_translations(where: {locale_code: {_eq: $locale_code}}) {
      content
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      search_description
      search_title
      twitter_description
      twitter_title
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
      }
    }
    slug
    author_articles(where: {author: {slug: {_eq: $author_slug}}}) {
      author {
        name
        photoUrl
        slug
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
    }
    tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
      tag {
        tag_translations {
          title
        }
        slug
      }
    }
  }
  categories(where: {published: {_eq: true}}) {
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
    slug
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
  authors(where: {slug: {_eq: $author_slug}}, limit: 1) {
    id
    slug
    author_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      bio
    }
    photoUrl
    name
    twitter
    staff
  }
}`;

const HASURA_LIST_ALL_SECTIONS = `query MyQuery {
  categories(where: {published: {_eq: true}}) {
    category_translations {
      title
      locale_code
    }
    slug
  }
}`;

const HASURA_GET_HOMEPAGE_LAYOUTS = `query MyQuery {
  homepage_layout_schemas {
    id
    name
    data
  }
}`;

export function hasuraSaveHomepageLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_HOMEPAGE,
    name: 'upsert_homepage_layout_data',
    variables: {
      locale_code: params['localeCode'],
      homepage_layout_schema_id: params['schemaId'],
      article_priority_1: params['article1'],
      article_priority_2: params['article2'],
      article_priority_3: params['article3'],
    },
  });
}

export function hasuraSearchArticles(params) {
  let term = '%' + params['term'] + '%';
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_SEARCH_ARTICLES,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
      term: term,
    },
  });
}

export function hasuraGetHomepageEditor(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_HOMEPAGE_EDITOR,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

export function hasuraGetHomepageLayouts(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_HOMEPAGE_LAYOUTS,
    name: 'MyQuery',
  });
}
export function hasuraGetHomepageData(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_HOMEPAGE_DATA,
    name: 'MyQuery',
  });
}

export function hasuraListAllTags(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_TAGS,
    name: 'MyQuery',
  });
}

export function hasuraListAllSections(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_ALL_SECTIONS,
    name: 'MyQuery',
  });
}

export function hasuraGetPage(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_PAGE,
    name: 'MyQuery',
    variables: {
      slug: params['slug'],
      locale_code: params['localeCode'],
    },
  });
}

export function hasuraGetMetadataByLocale(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_METADATA_BY_LOCALE,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

export function hasuraGetArticleBySlug(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_ARTICLE_BY_SLUG,
    name: 'MyQuery',
    variables: {
      slug: params['slug'],
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_LIST_ARTICLE_SLUGS = `query MyQuery {
  articles {
    slug
    article_translations(where: {published: {_eq: true}}) {
      locale_code
    }
    category {
      slug
    }
  }
}`;

export async function hasuraListAllArticleSlugs() {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    // url: params['url'],
    // orgSlug: params['orgSlug'],
    query: HASURA_LIST_ARTICLE_SLUGS,
    name: 'MyQuery',
  });
}

const HASURA_GET_AUTHOR_SLUGS = `query MyQuery {
  authors(where: {published: {_eq: true}}) {
    slug
    author_translations {
      locale_code
    }
  }
}`;

export async function hasuraListAllAuthorPaths() {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_GET_AUTHOR_SLUGS,
    name: 'MyQuery',
  });
}

export async function hasuraTagPage(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_TAG_PAGE,
    name: 'MyQuery',
    variables: {
      tag_slug: params['tagSlug'],
      locale_code: params['localeCode'],
    },
  });
}

export async function hasuraCategoryPage(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_CATEGORY_PAGE,
    name: 'MyQuery',
    variables: {
      category_slug: params['categorySlug'],
      locale_code: params['localeCode'],
    },
  });
}

export async function hasuraPreviewArticlePage(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_PREVIEW_ARTICLE_PAGE,
    name: 'MyQuery',
    variables: {
      category_slug: params['categorySlug'],
      locale_code: params['localeCode'],
    },
  });
}

export async function hasuraArticlePage(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_ARTICLE_PAGE,
    name: 'MyQuery',
    variables: {
      category_slug: params['categorySlug'],
      locale_code: params['localeCode'],
    },
  });
}

export async function hasuraAuthorPage(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_AUTHOR_PAGE,
    name: 'MyQuery',
    variables: {
      author_slug: params['authorSlug'],
      locale_code: params['localeCode'],
    },
  });
}

export async function listAllLocales() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const response = await webinyHeadlessCms.request(gql.LIST_LOCALES);

  return response.i18n.listI18NLocales.data;
}

export async function listAllSections() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const sectionsData = await webinyHeadlessCms.request(gql.LIST_SECTIONS);

  return sectionsData.categories.listCategories.data;
}

export async function listAllSectionTitles(locales) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const sectionsData = await webinyHeadlessCms.request(gql.LIST_SECTIONS);

  let slugs = [];
  for (const locale of locales) {
    sectionsData.categories.listCategories.data.map((section) => {
      slugs.push({
        params: {
          category: section.slug,
        },
        locale,
      });
    });
  }
  return slugs;
}

export async function listAllArticlesBySection(locale, section) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    where: {
      availableLocales_contains: locale.code,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    gql.LIST_ARTICLES,
    variables
  );

  let articlesBySection = [];
  articlesData.articles.listArticles.data.map((article) => {
    if (article.category.slug == section) {
      let articleContent;
      if (article.content && article.content.values) {
        articleContent = localiseText(locale, article.content);
      }
      try {
        article.content = JSON.parse(articleContent);
      } catch (e) {
        console.log(e);
        article.content = null;
      }
      // article.content = JSON.parse(article.content.values[0].value);
      articlesBySection.push(article);
    }
  });
  return articlesBySection;
}

export async function listAllAuthorPaths(locales) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const authorData = await webinyHeadlessCms.request(gql.LIST_AUTHORS);

  let slugs = [];
  for (const locale of locales) {
    authorData.authors.listAuthors.data.map((author) => {
      slugs.push({
        params: {
          slug: author.slug,
        },
        locale,
      });
    });
  }
  return slugs;
}

export async function listAllTagPaths(locales) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(gql.LIST_TAGS);

  let slugs = [];
  for (const locale of locales) {
    tagsData.tags.listTags.data.map((tag) => {
      slugs.push({
        params: {
          slug: tag.slug,
        },
        locale,
      });
    });
  }
  return slugs;
}

export async function listAllTags() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(gql.LIST_TAGS);

  const slugs = tagsData.tags.listTags.data.map((tag) => {
    return {
      id: tag.id,
      title: tag.title,
      slug: tag.slug,
    };
  });
  const slugsSorted = slugs.sort(function (a, b) {
    let comparison = 0;
    if (a.title > b.title) {
      comparison = 1;
    } else if (a.title < b.title) {
      comparison = -1;
    }
    return comparison;
  });
  return slugsSorted;
}

export async function listAllArticles() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(gql.LIST_ARTICLES);
  articlesData.articles.listArticles.data.map((article) => {
    article.content = JSON.parse(article.content.values[0].value);
  });
  return articlesData.articles.listArticles.data;
}

export async function listMostRecentArticles(locale) {
  const articlesData = await listArticlesInLocale(
    CONTENT_DELIVERY_API_URL,
    CONTENT_DELIVERY_API_ACCESS_TOKEN,
    locale.code
  );
  articlesData.map((article) => {
    let articleContent;
    if (article.content && article.content.values) {
      articleContent = localiseText(locale, article.content);
    }
    try {
      article.content = JSON.parse(articleContent);
    } catch (e) {
      console.log(e);
      article.content = null;
    }
  });
  return articlesData;
}

export async function listArticlesBySlug(slugs) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    where: {
      slug_in: slugs,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    gql.LIST_ARTICLES_BY_SLUG,
    variables
  );
  articlesData.articles.listArticles.data.map((article) => {
    try {
      article.content = JSON.parse(article.content.values[0].value);
    } catch (e) {
      console.log('error parsing json:', e);
    }
  });
  return articlesData.articles.listArticles.data;
}

export async function listAllArticlesByTag(locale, tag) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    where: {
      availableLocales_contains: locale.code,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    gql.LIST_ARTICLES,
    variables
  );
  let articlesByTag = [];
  articlesData.articles.listArticles.data.map((article) => {
    if (article.tags !== null && article.tags !== undefined) {
      for (var i = 0; i < article.tags.length; i++) {
        if (
          article.tags[i] &&
          article.tags[i] !== null &&
          article.tags[i].slug == tag
        ) {
          articlesByTag.push(article);
          break;
        }
      }
    }
  });

  articlesByTag.map((article) => {
    let articleContent;
    if (article.content && article.content.values) {
      articleContent = localiseText(locale, article.content);
    }
    try {
      article.content = JSON.parse(articleContent);
    } catch (e) {
      console.log(e);
      article.content = null;
    }
  });

  return articlesByTag;
}

export async function listAllArticlesByAuthor(locale, authorSlug) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    where: {
      authorSlugs_contains: authorSlug,
      availableLocales_contains: locale.code,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    gql.LIST_ARTICLES_BY_AUTHOR,
    variables
  );

  articlesData.articles.listArticles.data.map((article) => {
    let articleContent;
    if (article.content && article.content.values) {
      articleContent = localiseText(locale, article.content);
    }
    try {
      article.content = JSON.parse(articleContent);
    } catch (e) {
      console.log('error parsing json:', e);
    }
  });

  return articlesData.articles.listArticles.data;
}

export async function listAllArticleIds() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(gql.LIST_IDS);
  const ids = articlesData.articles.listArticles.data.map((article) => {
    return {
      params: {
        id: article.id,
      },
    };
  });
  return ids;
}

export async function listAllArticleSlugs(locales) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(gql.LIST_SLUGS);
  let slugs = [];
  for (const locale of locales) {
    articlesData.articles.listArticles.data.map((article) => {
      slugs.push({
        params: {
          category: article.category ? article.category.slug : null,
          slug: article.slug,
        },
        locale,
      });
    });
  }
  return slugs;
}

export async function getArticle(id) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(gql.GET_ARTICLE, { id });

  articlesData.getBasicArticle.data.content = JSON.parse(
    articlesData.getBasicArticle.data.content
  );
  return articlesData.getBasicArticle.data;
}

export async function getMostRecentArticle(locale, slug, apiUrl) {
  if (apiUrl === undefined) {
    apiUrl = CONTENT_DELIVERY_API_URL;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(gql.SEARCH_ARTICLES, {
    where: {
      availableLocales_contains: locale.code,
    },
  });
  let articleData;
  try {
    articleData = articlesData.articles.listArticles.data[0];
  } catch (e) {
    console.log('error grabbing first article:', e);
    return null;
  }
  let localisedContent;
  localisedContent = articleData.content.values.find(
    (item) => item.locale === locale.id
  );

  try {
    articleData.content = JSON.parse(localisedContent.value);
  } catch (e) {
    console.log(slug, 'failed parsing json:', e);
    articleData.content = JSON.parse(articleData.content.values[0].value); // for now fallback to the default locale; TODO revisit this
  }
  return articleData;
}

export async function getArticleBySlugNoLocale(slug, apiUrl) {
  if (apiUrl === undefined) {
    apiUrl = CONTENT_DELIVERY_API_URL;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
      accept: 'application/json',
    },
  });

  const articlesData = await webinyHeadlessCms.request(
    gql.GET_ARTICLE_BY_SLUG,
    {
      where: {
        slug: slug,
      },
    }
  );
  if (
    articlesData &&
    articlesData.articles &&
    articlesData.articles.listArticles &&
    articlesData.articles.listArticles.data &&
    articlesData.articles.listArticles.data[0]
  ) {
    let articleData = articlesData.articles.listArticles.data[0];
    return articleData;
  } else {
    throw Error(`Unable to find article with slug ${slug}`);
  }
}

export async function getArticleBySlug(locale, slug, apiUrl) {
  if (apiUrl === undefined) {
    apiUrl = CONTENT_DELIVERY_API_URL;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(
    gql.GET_ARTICLE_BY_SLUG,
    {
      where: {
        availableLocales_contains: locale.code,
        slug: slug,
      },
    }
  );
  // console.log("articlesData:", articlesData.articles.listArticles.data[0].content.values);
  let articleData;
  let localisedContent;
  if (
    articlesData &&
    articlesData.articles &&
    articlesData.articles.listArticles &&
    articlesData.articles.listArticles.data &&
    articlesData.articles.listArticles.data[0]
  ) {
    articleData = articlesData.articles.listArticles.data[0];
    localisedContent = articleData.content.values.find(
      (item) => item.locale === locale.id
    );
  } else {
    return null;
  }

  try {
    articleData.content = JSON.parse(localisedContent.value);
  } catch (e) {
    articleData.content = JSON.parse(articleData.content.values[0].value); // for now fallback to the default locale; TODO revisit this
  }

  return articleData;
}

export async function getHomepageArticles(locale, hpData) {
  if (hpData === null) {
    return {};
  }
  let hpArticles = {};
  let hpArticleData = hpData.articles;

  (async () => {
    // if for some reason the homepage layout data is blank, fall back to
    // the layout schema which at least has the structure defined
    // this is used in the tinynews homepage editor
    if (hpArticleData === undefined || hpArticleData === null) {
      let articleConfig = JSON.parse(hpData.layoutSchema.data);
      Object.entries(articleConfig).map(([key, value]) => {
        if (value === 'string') {
          hpArticles[key] = null;
        } else {
          hpArticles[key] = [];
        }
      });
    }

    if (hpArticleData !== undefined && hpArticleData !== null) {
      Object.entries(hpArticleData).map(([key, values]) => {
        if (typeof values === 'string') {
          let foundArticle;
          (async () => {
            foundArticle = await getArticleBySlug(locale, values);
            hpArticles[key] = foundArticle;
          })();
        } else {
          let foundArticles;
          (async () => {
            foundArticles = await listArticlesBySlug(values);
            hpArticles[key] = foundArticles;
          })();
        }
      });
    }
  })();

  return hpArticles;
}

export async function getTag(id) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(gql.GET_TAG_BY_ID, {
    id: id,
  });
  let tag = tagsData.tags.getTag.data;
  return tag;
}

export async function getTagBySlug(slug, apiUrl) {
  if (apiUrl === undefined) {
    apiUrl = CONTENT_DELIVERY_API_URL;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(gql.GET_TAG_BY_SLUG, {
    slug,
  });
  return tagsData.tags.listTags.data[0];
}

export async function createTag(url, token, titleValues, slug) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    data: {
      title: {
        values: titleValues,
      },
      slug: slug,
      published: true,
    },
  };

  const responseData = await webinyHeadlessCms.request(
    gql.CREATE_TAG,
    variables
  );
  return responseData;
}

export async function updateTag(url, token, tagId, titleValues, slug) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    id: tagId,
    data: {
      title: {
        values: titleValues,
      },
      slug: slug,
      published: true,
    },
  };

  const responseData = await webinyHeadlessCms.request(
    gql.UPDATE_TAG,
    variables
  );
  return responseData;
}

export async function getAuthorBySlug(slug, apiUrl) {
  if (apiUrl === undefined) {
    apiUrl = CONTENT_DELIVERY_API_URL;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const authorData = await webinyHeadlessCms.request(gql.GET_AUTHOR_BY_SLUG, {
    slug,
  });
  return authorData.authors.listAuthors.data[0];
}

//MOVE TO lib/static.js?
export async function getAboutPage() {
  const data = getPage('about');
  return data;
}

export async function getPage(slug) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const data = await webinyHeadlessCms.request(gql.GET_PAGE_BY_SLUG, {
    slug,
  });
  let pageData = data.pages.listPages.data[0];
  try {
    pageData.content = JSON.parse(pageData.content.values[0].value);
  } catch (e) {
    console.log(slug, 'failed parsing json:', e);
  }
  return pageData;
}

export async function listAuthors() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const authorsData = await webinyHeadlessCms.request(gql.LIST_AUTHORS);

  return authorsData.authors.listAuthors.data;
}

export async function searchArticles(url, token, term, locale) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    where: {
      headline_contains: term,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    gql.SEARCH_ARTICLES,
    variables
  );

  // this section maps the 'admin' API values to what the front-end expects from the read-only API
  // annoyingly the data structure differs
  let articles = [];
  articlesData.articles.listArticles.data.map((article) => {
    let articleContent;
    if (article.content && article.content.values) {
      articleContent = localiseText(locale, article.content);
      console.log('articleContent:', articleContent);
    }
    try {
      article.content = JSON.parse(articleContent);
    } catch (e) {
      console.log(e);
      article.content = null;
    }
    articles.push(article);
  });

  return articles;
}

export async function listArticlesInLocale(url, token, locale) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    where: {
      availableLocales_contains: locale,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    gql.SEARCH_ARTICLES,
    variables
  );

  return articlesData.articles.listArticles.data;
}
