import { fetchGraphQL } from './utils';

export const HASURA_LIST_ORG_LOCALES = `query FrontendListOrgLocales {
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
    name: 'FrontendListOrgLocales',
    variables: {
      locale_code: params['localeCode'],
      slug: params['slug'],
    },
  });
}

const HASURA_SEARCH_ARTICLES = `query FrontendSearchArticles($locale_code: String!, $term: String!) {
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

const HASURA_HOMEPAGE_EDITOR = `query FrontendHomepageEditor($locale_code: String) {
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

const HASURA_GET_HOMEPAGE_DATA = `query FrontendGetHomepage {
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

const HASURA_PREVIEW_ARTICLE_PAGE = `query FrontendPreviewArticlePage($slug: String!, $category_slug: String!, $locale_code: String!) {
  articles(where: {slug: {_eq: $slug}, article_translations: {locale_code: {_eq: $locale_code}}, category: {slug: {_eq: $category_slug}}}) {
    published_article_translations(where: {locale_code: {_eq: $locale_code}}) {
      article_translation {
        id
        first_published_at
        last_published_at
      }
    }
    article_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      id
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

const HASURA_ARTICLE_PAGE_SLUG_VERSION = `query FrontendArticlePageSlugVersion($category_slug: String!, $locale_code: String!, $slug: String!) {
  article_slug_versions(where: {slug: {_eq: $slug}, article: {article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}, category: {slug: {_eq: $category_slug}}}}) {
    article {
      article_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
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
          twitter
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

const HASURA_ARTICLE_PAGE = `query FrontendArticlePage($category_slug: String!, $locale_code: String!, $slug: String!) {
  articles(where: {article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}, category: {slug: {_eq: $category_slug}}, slug: {_eq: $slug}}) {
    article_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      id
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
        twitter
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

const HASURA_GET_METADATA_BY_LOCALE = `query FrontendGetMetadataByLocale($locale_code: String!) {
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

const HASURA_LIST_TAGS = `query FrontendListTags {
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

const HASURA_TAG_PAGE = `query FrontendTagPage($locale_code: String, $tag_slug: String!) {
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
    tag_articles(where: {article: {article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}}}, order_by: {article: {article_translations_aggregate: {min: {first_published_at: desc}}}}) {
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

const HASURA_CATEGORY_PAGE = `query FrontendCategoryPage($category_slug: String!, $locale_code: String!) {
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

const HASURA_GET_LAYOUT = `query FrontendGetLayout($locale_code: String!) {
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

const HASURA_GET_PAGE_SLUG_VERSION = `query FrontendGetPageSlugVersion($slug: String!, $locale_code: String = "") {
  page_slug_versions(where: {slug: {_eq: $slug}, page: {page_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}}}) {
    slug
    page {
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
      page_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
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
  }
  authors {
    id
    name
    created_at
    slug
    staff
    twitter
    photoUrl
    published
    author_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      bio
    }
  }
  categories(where: {published: {_eq: true}, category_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
    }
  }
}`;

const HASURA_GET_PAGE = `query FrontendGetPage($slug: String!, $locale_code: String!) {
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
    page_translations(where: {published: { _eq: true }, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
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

const HASURA_GET_PAGE_PREVIEW = `query FrontendGetPagePreview($slug: String!, $locale_code: String!) {
  pages(where: {slug: {_eq: $slug}, page_translations: {locale_code: {_eq: $locale_code}}}) {
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
    page_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
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
  categories(where: {category_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}}) {
    site_metadata_translations {
      data
    }
  }
}`;

const HASURA_PREVIEW_ARTICLE_BY_SLUG = `query FrontendPreviewArticleBySlug($slug: String!, $locale_code: String!) {
  articles(where: {slug: {_eq: $slug}, article_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    article_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
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

const HASURA_GET_ARTICLE_BY_SLUG = `query FrontendGetArticleBySlug($slug: String!, $locale_code: String!) {
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

const HASURA_AUTHOR_PAGE = `query FrontendAuthorPage($locale_code: String!, $author_slug: String!) {
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

const HASURA_LIST_ALL_SECTIONS = `query FrontendListAllSections {
  categories(where: {published: {_eq: true}}) {
    category_translations {
      title
      locale_code
    }
    slug
  }
}`;

const HASURA_GET_HOMEPAGE_LAYOUTS = `query FrontendGetHomepageLayouts {
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
    name: 'FrontendSearchArticles',
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
    name: 'FrontendHomepageEditor',
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
    name: 'FrontendGetHomepageLayouts',
  });
}
export function hasuraGetHomepageData(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_HOMEPAGE_DATA,
    name: 'FrontendGetHomepage',
  });
}

export function hasuraListAllTags(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_TAGS,
    name: 'FrontendListTags',
  });
}

export function hasuraListAllSections(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_ALL_SECTIONS,
    name: 'FrontendListAllSections',
  });
}

export function hasuraGetPagePreview(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_PAGE_PREVIEW,
    name: 'FrontendGetPagePreview',
    variables: {
      slug: params['slug'],
      locale_code: params['localeCode'],
    },
  });
}

export function hasuraGetPage(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_PAGE_SLUG_VERSION,
    name: 'FrontendGetPageSlugVersion',
    variables: {
      slug: params['slug'],
      locale_code: params['localeCode'],
    },
  });
}

export function hasuraGetLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_LAYOUT,
    name: 'FrontendGetLayout',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

export function hasuraGetMetadataByLocale(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_METADATA_BY_LOCALE,
    name: 'FrontendGetMetadataByLocale',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

export function hasuraPreviewArticleBySlug(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_PREVIEW_ARTICLE_BY_SLUG,
    name: 'FrontendPreviewArticleBySlug',
    variables: {
      slug: params['slug'],
      locale_code: params['localeCode'],
    },
  });
}
export function hasuraGetArticleBySlug(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_ARTICLE_BY_SLUG,
    name: 'FrontendGetArticleBySlug',
    variables: {
      slug: params['slug'],
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_LIST_PAGE_SLUGS_PREVIEW = `query FrontendListPageSlugsPreview {
  pages {
    slug
    page_translations(distinct_on: locale_code) {
      locale_code
      published
    }
  }
}`;

const HASURA_LIST_PAGE_SLUGS = `query FrontendListPageSlugs {
  pages(where: {page_translations: {published: {_eq: true}}}) {
    slug
    page_translations(where: {published: {_eq: true}}, distinct_on: locale_code) {
      locale_code
      published
    }
  }
}`;

export async function hasuraListAllPageSlugsPreview() {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_LIST_PAGE_SLUGS_PREVIEW,
    name: 'FrontendListPageSlugsPreview',
  });
}
export async function hasuraListAllPageSlugs() {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_LIST_PAGE_SLUGS,
    name: 'FrontendListPageSlugs',
  });
}

const HASURA_LIST_ARTICLE_SLUGS = `query FrontendListArticleSlugs {
  articles(where: {article_translations: {published: {_eq: true}}}) {
    slug
    article_translations(where: {published: {_eq: true}}, distinct_on: locale_code) {
      locale_code
      published
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
    query: HASURA_LIST_ARTICLE_SLUGS,
    name: 'FrontendListArticleSlugs',
  });
}

const HASURA_GET_AUTHOR_SLUGS = `query FrontendGetAuthorSlugs {
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
    name: 'FrontendGetAuthorSlugs',
  });
}

export async function hasuraTagPage(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_TAG_PAGE,
    name: 'FrontendTagPage',
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
    name: 'FrontendCategoryPage',
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
    name: 'FrontendPreviewArticlePage',
    variables: {
      slug: params['slug'],
      category_slug: params['categorySlug'],
      locale_code: params['localeCode'],
    },
  });
}

export async function hasuraArticlePage(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_ARTICLE_PAGE_SLUG_VERSION,
    name: 'FrontendArticlePageSlugVersion',
    variables: {
      category_slug: params['categorySlug'],
      locale_code: params['localeCode'],
      slug: params['slug'],
    },
  });
}

export async function hasuraAuthorPage(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_AUTHOR_PAGE,
    name: 'FrontendAuthorPage',
    variables: {
      author_slug: params['authorSlug'],
      locale_code: params['localeCode'],
    },
  });
}
