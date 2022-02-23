import { fetchGraphQL } from './graphql';

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
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      main_image
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
        first_names
        last_name
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
      article_translations(where: {published: {_eq: true}}, order_by: {id: desc}) {
        custom_byline
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        main_image
        search_description
        search_title
        twitter_description
        twitter_title
        updated_at
        locale_code
      }
      category {
        slug
        id
        category_translations {
          locale_code
          title
        }
      }
      slug
      author_articles {
        author {
          first_names
          last_name
          photoUrl
          slug
          author_translations {
            locale_code
            title
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}}}) {
        tag {
          tag_translations {
            locale_code
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
      article_translations(where: {published: {_eq: true}}, order_by: {id: desc}) {
        main_image
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
        locale_code
      }
      category {
        slug
        id
        category_translations {
          locale_code
          title
        }
      }
      slug
      author_articles {
        author {
          first_names
          last_name
          photoUrl
          slug
          author_translations {
            locale_code
            title
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}}}) {
        tag {
          tag_translations {
            locale_code
            title
          }
          slug
        }
      }
    }
    third_article {
      id
      article_translations(where: {published: {_eq: true}}, order_by: {id: desc}) {
        main_image
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
        locale_code
      }
      category {
        slug
        id
        category_translations {
          locale_code
          title
        }
      }
      slug
      author_articles {
        author {
          first_names
          last_name
          photoUrl
          slug
          author_translations {
            locale_code
            title
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}}}) {
        tag {
          tag_translations {
            title
            locale_code
          }
          slug
        }
      }
    }
  }
  categories {
    category_translations {
      title
      locale_code
    }
    published
    slug
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  pages(where: {page_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}}) {
    slug
    page_translations(where: {published: {_eq: true}}, distinct_on: locale_code) {
      locale_code
      published
      headline
    }
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
    tag_translations {
      title
      locale_code
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
      locale_code
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
    canonical_url
    slug
    author_articles {
      author {
        first_names
        last_name
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
  categories {
    category_translations(where:{locale_code:{_eq: $locale_code}}) {
      title
      locale_code
    }
    published
    slug
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  published_article_translations(where: {article: {slug: {_eq: $slug}}}) {
    locale_code
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

const HASURA_ARTICLE_PAGE_SLUG_VERSION = `query FrontendArticlePageSlugVersion($category_slug: String!, $slug: String!) {
  article_slug_versions(
    where: {
      slug: {_eq: $slug},
      category_slug: {_eq: $category_slug}
      article: {
        article_translations: {
          published: {_eq: true}
        }
      }
    }) {
    article {
      article_translations(where: {published: {_eq: true}}, order_by: {id: desc}) {
        id
        content
        custom_byline
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        locale_code
        search_description
        search_title
        twitter_description
        twitter_title

      }
      category {
        slug
        published
        id
        category_translations {
          locale_code
          title
        }
      }
      canonical_url
      slug
      author_articles {
        author {
          first_names
          last_name
          photoUrl
          twitter
          slug
          author_translations {
            title
            locale_code
            bio
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}}}) {
        tag {
          tag_translations {
            locale_code
            title
          }
          slug
        }
      }
    }
  }
  categories {
    category_translations {
      title
      locale_code
    }
    id
    published
    slug
  }
  organization_locales {
    locale {
      code
      name
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
  site_metadatas(where: {published: {_eq: true}}) {
    site_metadata_translations {
      data
      locale_code
    }
  }
  published_article_translations(where: {article: {slug: {_eq: $slug}}}) {
    locale_code
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
        first_names
        last_name
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
  categories {
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
    published
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
  authors {
    first_names
    last_name
    slug
  }
  categories {
    slug
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
  }
  pages {
    slug
    page_translations(where: {locale_code: {_eq: $locale_code}}) {
      headline
      locale_code
    }
  }
  tags {
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
  }
}`;

const HASURA_LIST_TAGS_BY_LOCALE = `query FrontendListTagsByLocale($locale_code: String!) {
  organization_locales {
    locale {
      code
    }
  }
  tags(where: {published: {_eq: true}}, order_by: {slug: asc}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}) {
      locale_code
      title
    }
    tag_articles_aggregate {
      aggregate {
        count
      }
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

const HASURA_TAG_PAGE = `query FrontendTagPage($tag_slug: String!) {
  categories {
    category_translations(where: {}) {
      title
      locale_code
    }
    published
    slug
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  site_metadatas(where: {site_metadata_translations: {}, published: {_eq: true}}) {
    site_metadata_translations(where: {}) {
      data
      locale_code
    }
  }
  tags(where: {slug: {_eq: $tag_slug}}) {
    id
    slug
    tag_translations(where: {}) {
      title
      locale_code
    }
    tag_articles(where: {article: {article_translations: {published: {_eq: true}}}}, order_by: {article: {article_translations_aggregate: {min: {first_published_at: desc}}}}) {
      article {
        article_translations(where: {}) {
          custom_byline
          facebook_description
          facebook_title
          first_published_at
          headline
          last_published_at
          main_image
          search_description
          search_title
          twitter_description
          twitter_title
          locale_code
        }
        category {
          slug
          id
          category_translations(where: {}) {
            title
            locale_code
          }
        }
        slug
        author_articles {
          author {
            first_names
            last_name
            photoUrl
            slug
            author_translations(where: {}) {
              title
              locale_code
            }
          }
        }
      }
    }
  }
}`;

const HASURA_CATEGORY_PAGE = `query FrontendCategoryPage($category_slug: String!) {
  articles(order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}, where: {article_translations: {published: {_eq: true}}, category: {slug: {_eq: $category_slug}}}) {
    article_translations {
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      main_image
      search_description
      search_title
      twitter_description
      twitter_title
      locale_code
    }
    category {
      slug
      published
      id
      category_translations {
        locale_code
        title
      }
    }
    slug
    author_articles {
      author {
        first_names
        last_name
        photoUrl
        slug
        author_translations {
          locale_code
          title
        }
      }
    }
  }
  categories {
    category_translations {
      title
      locale_code
    }
    published
    slug
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  site_metadatas(where: {published: {_eq: true}}) {
    site_metadata_translations {
      data
      locale_code
    }
  }
  tags(where: {published: {_eq: true}}) {
    slug
    tag_translations {
      locale_code
      title
    }
  }
}`;

const HASURA_GET_LAYOUT = `query FrontendGetLayout($locale_code: String!) {
  categories(where: {category_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    published
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

const HASURA_GET_PAGE_SLUG_VERSION = `query FrontendGetPageSlugVersion($slug: String!) {
  page_slug_versions(where: {slug: {_eq: $slug}, page: {page_translations: {published: {_eq: true}}}}) {
    slug
    page {
      id
      author_pages {
        author {
          id
          first_names
          last_name
          slug
          photoUrl
          author_translations(where: {}) {
            title
            locale_code
          }
        }
      }
      page_translations(where: {published: {_eq: true}}, order_by: {id: desc}) {
        content
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        locale_code
        locale {
          code
          name
        }
        published
        search_description
        search_title
        twitter_description
        twitter_title
      }
      slug
    }
  }
  authors(order_by: {last_name: asc}) {
    id
    first_names
    last_name
    created_at
    slug
    staff
    twitter
    photoUrl
    published
    author_translations(where: {}) {
      title
      bio
      locale_code
    }
  }
  categories(where: {category_translations: {}}) {
    slug
    published
    category_translations(where: {}) {
      title
      locale_code
    }
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  pages(where: {slug: {_eq: $slug}, page_translations: {published: {_eq: true}}}) {
    page_translations {
      locale {
        code
        name
      }
      id
    }
  }
  site_metadatas(where: {site_metadata_translations: {}, published: {_eq: true}}) {
    site_metadata_translations(where: {}) {
      data
      locale_code
    }
  }
}`;

const HASURA_GET_PAGE = `query FrontendGetPage($slug: String!, $locale_code: String!) {
  pages(where: {slug: {_eq: $slug}, page_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}}) {
    id
    author_pages {
      author {
        id
        first_names
        last_name
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
  categories(where: {category_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    published
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
  page_slug_versions(where: {slug: {_eq: $slug}, page: {page_translations: {locale_code: {_eq: $locale_code}}}}) {
    slug
    page {
      id
      author_pages {
        author {
          id
          first_names
          last_name
          slug
          photoUrl
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
        locale_code
        locale {
          code
          name
        }
        published
        search_description
        search_title
        twitter_description
        twitter_title
      }
      slug
    }
  }
  authors(order_by: {last_name: asc}) {
    id
    first_names
    last_name
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
  categories(where: {category_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    published
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  pages(where: {slug: {_eq: $slug}, page_translations: {}}) {
    page_translations {
      locale {
        code
        name
      }
      id
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
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
        first_names
        last_name
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
        first_names
        last_name
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

const HASURA_AUTHOR_PAGE = `query FrontendAuthorPage($author_slug: String!) {
  articles(order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}, where: {article_translations: {published: {_eq: true}}, author_articles: {author: {slug: {_eq: $author_slug}}}}) {
    article_translations {
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      main_image
      search_description
      search_title
      twitter_description
      twitter_title
      locale_code
    }
    category {
      slug
      id
      published
      category_translations {
        locale_code
        title
      }
    }
    slug
    author_articles(where: {author: {slug: {_eq: $author_slug}}}) {
      author {
        first_names
        last_name
        photoUrl
        slug
        author_translations {
          locale_code
          title
        }
      }
    }
    tag_articles(where: {tag: {published: {_eq: true}}}) {
      tag {
        tag_translations {
          locale_code
          title
        }
        slug
      }
    }
  }
  categories {
    category_translations {
      title
      locale_code
    }
    published
    slug
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  site_metadatas(where: { published: {_eq: true} }) {
    site_metadata_translations {
      data
      locale_code
    }
  }
  authors(where: {slug: {_eq: $author_slug}}, limit: 1) {
    id
    slug
    author_translations {
      bio
      locale_code
      title
    }
    photoUrl
    first_names
    last_name
    twitter
    staff
  }
}`;

const HASURA_LIST_ALL_SECTIONS = `query FrontendListAllSections {
  categories {
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

const HASURA_GET_SITE_METADATA = `query FrontendGetSiteMetadata($locale_code: String!) {
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
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
  let searchVariables = {
    locale_code: params['localeCode'],
    term: term,
  };
  // console.log('params:', params, 'search variables:', searchVariables);

  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_SEARCH_ARTICLES,
    name: 'FrontendSearchArticles',
    variables: searchVariables,
  });
}

export function hasuraGetHomepageEditor(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
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

export function hasuraListAllTagsByLocale(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_LIST_TAGS_BY_LOCALE,
    name: 'FrontendListTagsByLocale',
    variables: {
      locale_code: params['locale_code'],
    },
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
  // console.log('url:', params['url'], 'orgSlug:', params['orgSlug']);
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
    site: params['site'],
    query: HASURA_GET_PAGE_SLUG_VERSION,
    name: 'FrontendGetPageSlugVersion',
    variables: {
      slug: params['slug'],
    },
  });
}

export function hasuraGetLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
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
    site: params['site'],
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
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
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
      headline
    }
  }
}`;

const HASURA_LIST_PAGE_SLUGS = `query FrontendListPageSlugs {
  pages(where: {page_translations: {published: {_eq: true}}}) {
    slug
    page_translations(where: {published: {_eq: true}}, distinct_on: locale_code) {
      locale_code
      published
      headline
    }
  }
}`;

export async function hasuraListAllPageSlugsPreview(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_LIST_PAGE_SLUGS_PREVIEW,
    name: 'FrontendListPageSlugsPreview',
  });
}
export async function hasuraListAllPageSlugs(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_LIST_PAGE_SLUGS,
    name: 'FrontendListPageSlugs',
  });
}

const HASURA_LIST_ARTICLE_SLUGS = `query FrontendListArticlesPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
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
  }
}`;

export async function hasuraListAllArticleSlugs(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let adminSecret = params['adminSecret'] || process.env.HASURA_ADMIN_SECRET;
  return fetchGraphQL({
    url: url,
    adminSecret: adminSecret,
    query: HASURA_LIST_ARTICLE_SLUGS,
    name: 'FrontendListArticlesPagePaths',
  });
}

const HASURA_LIST_ARTICLE_PREVIEW_SLUGS = `query FrontendListArticlePreviewsPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    articles {
      slug
      article_translations(distinct_on: locale_code) {
        locale_code
        published
      }
      category {
        slug
      }
    }
  }
}`;

export async function hasuraListAllArticlePreviewSlugs(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let adminSecret = params['adminSecret'] || process.env.HASURA_ADMIN_SECRET;
  return fetchGraphQL({
    url: url,
    adminSecret: adminSecret,
    query: HASURA_LIST_ARTICLE_PREVIEW_SLUGS,
    name: 'FrontendListArticlePreviewsPagePaths',
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

export async function hasuraListAllAuthorPaths(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_GET_AUTHOR_SLUGS,
    name: 'FrontendGetAuthorSlugs',
  });
}

export async function hasuraTagPage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_TAG_PAGE,
    name: 'FrontendTagPage',
    variables: {
      tag_slug: params['tagSlug'],
    },
  });
}

export async function hasuraCategoryPage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;

  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_CATEGORY_PAGE,
    name: 'FrontendCategoryPage',
    variables: {
      category_slug: params['categorySlug'],
    },
  });
}

export async function hasuraPreviewArticlePage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;

  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
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
  let url = params['url'] || process.env.HASURA_API_URL;
  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_ARTICLE_PAGE_SLUG_VERSION,
    name: 'FrontendArticlePageSlugVersion',
    variables: {
      category_slug: params['categorySlug'],
      slug: params['slug'],
    },
  });
}

export async function hasuraAuthorPage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;

  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_AUTHOR_PAGE,
    name: 'FrontendAuthorPage',
    variables: {
      author_slug: params['authorSlug'],
    },
  });
}

export async function hasuraGetSiteMetadata(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_GET_SITE_METADATA,
    name: 'FrontendGetSiteMetadata',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_UPDATE_ARTICLE = `mutation FrontendTestingUpdateArticle($id: Int!, $locale_code: String!, $created_by_email: String, $headline: String!, $published: Boolean, $category_id: Int!, $slug: String!, $document_id: String, $url: String, $custom_byline: String, $content: jsonb, $facebook_description: String, $facebook_title: String, $search_description: String, $search_title: String, $twitter_description: String, $twitter_title: String, $article_sources: [article_source_insert_input!]!) {
  insert_articles(
    objects: {
      article_translations: {
        data: {
          created_by_email: $created_by_email,
          headline: $headline,
          locale_code: $locale_code,
          published: $published,
          content: $content,
          custom_byline: $custom_byline,
          facebook_description: $facebook_description,
          facebook_title: $facebook_title,
          search_description: $search_description,
          search_title: $search_title,
          twitter_description: $twitter_description,
          twitter_title: $twitter_title
        }
      },
      category_id: $category_id,
      slug: $slug,
      id: $id,
      article_sources: {
        data: $article_sources,
        on_conflict: {constraint: article_source_article_id_source_id_key, update_columns: article_id}
      },
      article_google_documents: {
        data: {
          google_document: {
            data: {
              document_id: $document_id,
              locale_code: $locale_code,
              url: $url
            },
            on_conflict: {
              constraint: google_documents_organization_id_document_id_key, update_columns: locale_code
            }
          }
        },
        on_conflict: {
          constraint: article_google_documents_article_id_google_document_id_key, update_columns: google_document_id
        }
      }
    },
    on_conflict: {
      constraint: articles_slug_category_id_organization_id_key, update_columns: [slug, updated_at]
    }
  ) {
    returning {
      id
      slug
      updated_at
      created_at
      article_google_documents {
        id
        google_document {
          document_id
          locale_code
          url
          id
        }
      }
      article_sources {
        source {
          affiliation
          age
          email
          ethnicity
          gender
          id
          name
          phone
          race
          role
          sexual_orientation
          zip
        }
      }
      category {
        slug
      }
      article_translations(where: { locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
        article_id
        locale_code
        published
      }
      published_article_translations(where: {locale_code: {_eq: $locale_code}}) {
        article_translation {
          id
          first_published_at
          last_published_at
          locale_code
        }
      }
    }
  }
}`;

const HASURA_CREATE_ARTICLE = `mutation FrontendTestingCreateArticle($locale_code: String!, $created_by_email: String, $headline: String!, $published: Boolean, $category_id: Int!, $slug: String!, $document_id: String, $url: String, $custom_byline: String, $content: jsonb, $facebook_description: String, $facebook_title: String, $search_description: String, $search_title: String, $twitter_description: String, $twitter_title: String, $article_sources: [article_source_insert_input!]!) {
  insert_articles(
    objects: {
      article_translations: {
        data: {
          created_by_email: $created_by_email,
          headline: $headline,
          locale_code: $locale_code,
          published: $published,
          content: $content,
          custom_byline: $custom_byline,
          facebook_description: $facebook_description,
          facebook_title: $facebook_title,
          search_description: $search_description,
          search_title: $search_title,
          twitter_description: $twitter_description,
          twitter_title: $twitter_title
        }
      },
      category_id: $category_id,
      slug: $slug,

      article_sources: {
        data: $article_sources,
        on_conflict: {constraint: article_source_article_id_source_id_key, update_columns: article_id}
      },
      article_google_documents: {
        data: {
          google_document: {
            data: {
              document_id: $document_id,
              locale_code: $locale_code,
              url: $url
            },
            on_conflict: {
              constraint: google_documents_organization_id_document_id_key, update_columns: locale_code
            }
          }
        },
        on_conflict: {
          constraint: article_google_documents_article_id_google_document_id_key, update_columns: google_document_id
        }
      }
    },
    on_conflict: {
      constraint: articles_slug_category_id_organization_id_key, update_columns: [category_id, slug, updated_at]
    }
  ) {
    returning {
      id
      slug
      updated_at
      created_at
      article_google_documents {
        id
        google_document {
          document_id
          locale_code
          url
          id
        }
      }
      article_sources {
        source {
          affiliation
          age
          email
          ethnicity
          gender
          id
          name
          phone
          race
          role
          sexual_orientation
          zip
        }
      }
      category {
        id
        slug
      }
      article_translations(where: { locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
        article_id
        locale_code
        published
      }
      published_article_translations(where: {locale_code: {_eq: $locale_code}}) {
        article_translation {
          id
          first_published_at
          last_published_at
          locale_code
        }
      }
    }
  }
}`;

export async function hasuraCreateArticle(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_CREATE_ARTICLE,
    name: 'FrontendTestingCreateArticle',
    variables: {
      published: params['published'],
      slug: params['slug'],
      locale_code: params['locale_code'],
      headline: params['headline'],
      category_id: params['category_id'],
      content: params['content'],
      search_title: params['search_title'],
      search_description: params['search_description'],
      document_id: params['document_id'],
      url: params['url'],
      created_by_email: params['created_by_email'],
      article_sources: params['article_sources'],
    },
  });
}

export async function hasuraUpdateArticle(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;

  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_UPDATE_ARTICLE,
    name: 'FrontendTestingUpdateArticle',
    variables: {
      id: params['id'],
      published: params['published'],
      slug: params['slug'],
      locale_code: params['locale_code'],
      headline: params['headline'],
      category_id: params['category_id'],
      content: params['content'],
      search_title: params['search_title'],
      search_description: params['search_description'],
      document_id: params['document_id'],
      url: params['url'],
      created_by_email: params['created_by_email'],
      article_sources: params['article_sources'],
    },
  });
}

const HASURA_CREATE_PAGE = `mutation FrontendTestingCreatePage($slug: String!, $locale_code: String!, $created_by_email: String, $document_id: String, $url: String, $facebook_title: String, $facebook_description: String, $search_title: String, $search_description: String, $headline: String, $twitter_title: String, $twitter_description: String, $content: jsonb, $published: Boolean) {
  insert_pages(
    objects: {
      page_google_documents: {
        data: {
          google_document: {
            data: {
              document_id: $document_id, locale_code: $locale_code, url: $url
            },
            on_conflict: {
              constraint: google_documents_organization_id_document_id_key,
              update_columns: [document_id]
            }
          }
        },
        on_conflict: {
          constraint: page_google_documents_page_id_google_document_id_key,
          update_columns: [google_document_id]
        }
      },
      slug: $slug,
      page_translations: {
        data: {
          created_by_email: $created_by_email, published: $published, search_description: $search_description, search_title: $search_title, twitter_description: $twitter_description, twitter_title: $twitter_title, locale_code: $locale_code, headline: $headline, facebook_title: $facebook_title, facebook_description: $facebook_description, content: $content
        }
      }
    },
    on_conflict: {
      constraint: pages_slug_organization_id_key,
      update_columns: [slug, updated_at]
    }) {
    returning {
      id
      slug
      page_google_documents {
        id
        google_document {
          document_id
          locale_code
          url
        }
      }
      page_translations(where: { locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        published
      }
    }
  }
}`;

export async function hasuraCreatePage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_CREATE_PAGE,
    name: 'FrontendTestingCreatePage',
    variables: {
      published: params['published'],
      slug: params['slug'],
      locale_code: params['locale_code'],
      headline: params['headline'],
      content: params['content'],
      search_title: params['search_title'],
      search_description: params['search_description'],
      document_id: params['document_id'],
      created_by_email: params['created_by_email'],
    },
  });
}

const DELETE_ARTICLES_MUTATION = `mutation DeleteArticles {
  delete_article_google_documents(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_article_source(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_homepage_layout_datas(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_tag_articles(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_article_slug_versions(where: {article_id: {_gt: 0}}) {
    affected_rows
  }
  delete_published_article_translations(where:{id:{_gt: 0}}) {
    affected_rows
  }
  delete_article_translations(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_author_articles(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_articles(where: {id: {_gt: 0}}) {
    affected_rows
  }
}`;

export async function hasuraDeleteArticles(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: DELETE_ARTICLES_MUTATION,
    name: 'DeleteArticles',
  });
}

const HASURA_LIST_ARTICLES_ARCHIVE_PAGES = `query FrontendPaginatedListArticlesArchivePages {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    articles_aggregate(where: {article_translations: {published: {_eq: true}}}) {
      aggregate {
        count
      }
    }
  }
}`;

const HASURA_PAGINATED_ARTICLES_ARCHIVE_PAGE = `query FrontendPaginatedArticlesArchivePage($limit: Int, $offset: Int) {
  articles_aggregate(where: {article_translations: {published: {_eq: true}}}) {
    aggregate {
      count
    }
  }
  articles(where: {article_translations: {published: {_eq: true}}}, limit: $limit, offset: $offset, order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}) {
    id
    slug
    article_translations(where: {published: {_eq: true}}, order_by: {id: desc}) {
      custom_byline
      first_published_at
      headline
      last_published_at
      main_image
      published
      search_description
      updated_at
      locale_code
    }
    author_articles {
      author {
        first_names
        last_name
        photoUrl
        slug
        twitter
        author_translations(where: {}) {
          bio
          title
          locale_code
        }
      }
    }
    category {
      slug
      category_translations(where: {}) {
        title
        locale_code
      }
    }
  }
  categories {
    category_translations(where: {}) {
      title
      locale_code
    }
    published
    slug
  }
  site_metadatas(where: {site_metadata_translations: {}, published: {_eq: true}}) {
    site_metadata_translations(where: {}) {
      data
      locale_code
    }
  }
  tags(where: {published: {_eq: true}}) {
    id
    slug
    tag_translations(where: {}) {
      title
      locale_code
    }
  }
}`;

export async function hasuraArticlesArchivePage(params) {
  let limit = parseInt(params['limit'] || '10');
  let offset = parseInt(params['offset'] || '0');

  return fetchGraphQL({
    url: params['url'],
    query: HASURA_PAGINATED_ARTICLES_ARCHIVE_PAGE,
    name: 'FrontendPaginatedArticlesArchivePage',
    variables: {
      limit: limit,
      offset: offset,
    },
  });
}

export async function hasuraListArticleArchivePages() {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_LIST_ARTICLES_ARCHIVE_PAGES,
    name: 'FrontendPaginatedListArticlesArchivePages',
  });
}

const HASURA_INSERT_ARTICLE_SLUG_VERSIONS = `mutation FrontendInsertArticleSlugVersions($objects: [article_slug_versions_insert_input!] = {}) {
  insert_article_slug_versions(objects: $objects, on_conflict: {constraint: slug_versions_pkey, update_columns: category_slug}) {
    affected_rows
  }
}
`;
export async function hasuraInsertArticleSlugVersions(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_INSERT_ARTICLE_SLUG_VERSIONS,
    name: 'FrontendInsertArticleSlugVersions',
    variables: {
      objects: params['objects'],
    },
  });
}

const HASURA_LOOKUP_GOOGLE_DOC = `query ApiLookupGoogleDoc($document_id: String!) {
  google_documents(where: {document_id: {_eq: $document_id}}) {
    article_google_documents {
      article {
        id
        slug
        canonical_url
        category {
          id
          slug
          title
        }
        author_articles {
          author {
            id
            first_names
            last_name
            slug
          }
        }
        article_sources {
          source {
            affiliation
            age
            created_at
            email
            ethnicity
            gender
            id
            name
            phone
            race
            role
            sexual_orientation
            updated_at
            zip
          }
        }
        tag_articles {
          tag_id
        }
        article_translations(order_by: {id: desc}, limit: 1) {
          custom_byline
          facebook_description
          facebook_title
          first_published_at
          headline
          id
          last_published_at
          locale_code
          published
          search_description
          search_title
          twitter_description
          twitter_title
          published_article_translations {
            article_translation {
              first_published_at
              id
              locale_code
              last_published_at
            }
          }
        }
      }
      google_document {
        locale_code
      }
    }
    page_google_documents {
      google_document {
        locale_code
      }
      page {
        id
        slug
        author_pages {
          author {
            first_names
            last_name
            id
            slug
          }
        }
        page_translations(limit: 1, order_by: {id: desc}) {
          facebook_description
          facebook_title
          first_published_at
          headline
          id
          last_published_at
          locale_code
          published
          search_description
          search_title
          twitter_title
          twitter_description
        }
      }
    }
  }
  authors {
    id
    slug
    first_names
    last_name
  }
  categories {
    id
    published
    slug
    category_translations(where: {locale_code: {_eq: "en-US"}}) {
      locale_code
      title
    }
  }
  homepage_layout_datas {
    article_priority_1
    article_priority_2
    article_priority_3
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  tags {
    id
    slug
    tag_translations(where: {locale_code: {_eq: "en-US"}}) {
      locale_code
      title
    }
  }
}`;

export async function hasuraLookupGoogleDoc(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LOOKUP_GOOGLE_DOC,
    name: 'ApiLookupGoogleDoc',
    variables: {
      document_id: params['documentId'],
    },
  });
}

const HASURA_GET_GOOGLE_DOCS_FOR_ARTICLE = `query ApiLookupGoogleDocsForArticle($article_id: Int!, $locale_code: String!) {
  article_google_documents(where: {article_id: {_eq: $article_id}}) {
    google_document {
      document_id
      locale_code
      locale {
        code
        name
      }
      url
    }
    article_id
  }
  published_article_translations(where: {locale_code: {_eq: $locale_code}, article_id: {_eq: $article_id}}) {
    article_translation {
      id
      first_published_at
      last_published_at
      locale_code
    }
  }
}`;

export async function hasuraGetGoogleDocsForArticle(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_GOOGLE_DOCS_FOR_ARTICLE,
    name: 'ApiLookupGoogleDocsForArticle',
    variables: {
      article_id: params['articleId'],
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_GET_GOOGLE_DOCS_FOR_PAGE = `query ApiLookupGoogleDocsForPage($page_id: Int!) {
  page_google_documents(where: {page_id: {_eq: $page_id}}) {
    google_document {
      document_id
      locale_code
      locale {
        code
        name
      }
      url
    }
    page_id
  }
}`;

export async function hasuraGetGoogleDocsForPage(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_GOOGLE_DOCS_FOR_PAGE,
    name: 'ApiLookupGoogleDocsForPage',
    variables: {
      page_id: params['pageId'],
    },
  });
}

const HASURA_LIST_DOMAINS = `query FrontendListCustomDomainsAndSubdomains {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
  }
}`;

export async function listDomains(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_DOMAINS,
    name: 'FrontendListCustomDomainsAndSubdomains',
  });
}

// used to create a list of subdomain or custom domain values to map to each `_sites/[site]`
// and locale available for each org
// example, the about page has 2 entries for Oaklyn ('next-tinynewsdemo', 'about', 'en-US'; 'next-tinynewsdemo', 'about', 'es')
// and 1 entry for BBG (blackbygod.org, 'about', 'en-US')
export async function generateAllDomainPaths(params) {
  const { errors, data } = await listDomains(params);
  if (errors) {
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.organization_locales.length; x++) {
      let orgLocale = org.organization_locales[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }

      allPaths.push({
        params: siteParams,
        locale: orgLocale.locale.code,
      });
    }
  }

  return allPaths;
}

const HASURA_LIST_CATEGORY_PAGE_PATHS = `query FrontendListCategoryPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    categories(where: {published: {_eq: true}}) {
      id
      slug
      category_translations {
        locale_code
        title
      }
      
    }
  }
}`;

export async function listCategoryPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_CATEGORY_PAGE_PATHS,
    name: 'FrontendListCategoryPagePaths',
  });
}

const HASURA_LIST_TAG_PAGE_PATHS = `query FrontendListTagPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
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
  }
}`;

export async function listTagPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_TAG_PAGE_PATHS,
    name: 'FrontendListTagPagePaths',
  });
}

const HASURA_LIST_STATIC_PREVIEW_PAGE_PATHS = `query FrontendListStaticPreviewPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    pages {
      slug
      page_translations(distinct_on: locale_code) {
        locale_code
        published
        headline
      }
    }
  }
}`;

export async function listStaticPreviewPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_STATIC_PREVIEW_PAGE_PATHS,
    name: 'FrontendListStaticPreviewPagePaths',
  });
}

const HASURA_LIST_STATIC_PAGE_PATHS = `query FrontendListStaticPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    pages(where: {page_translations: {published: {_eq: true}}}) {
      slug
      page_translations(where: {published: {_eq: true}}, distinct_on: locale_code) {
        locale_code
        published
        headline
      }
    }
  }
}`;

export async function listStaticPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_STATIC_PAGE_PATHS,
    name: 'FrontendListStaticPagePaths',
  });
}

export async function generateAllStaticPagePaths(params = {}) {
  let result;
  if (params['preview']) {
    result = await listStaticPreviewPagePaths(params);
  } else {
    result = await listStaticPagePaths(params);
  }

  if (result.errors) {
    throw result.errors;
  }

  let allPaths = [];
  for (let i = 0; i < result.data.organizations.length; i++) {
    let org = result.data.organizations[i];

    for (let x = 0; x < org.pages.length; x++) {
      let page = org.pages[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['slug'] = page.slug;
      for (let y = 0; y < page.page_translations.length; y++) {
        allPaths.push({
          params: siteParams,
          locale: page.page_translations[y].locale_code,
        });
      }
    }
  }

  return allPaths;
}

export async function generateAllTagPagePaths(params = {}) {
  const { errors, data } = await listTagPagePaths(params);
  if (errors) {
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.tags.length; x++) {
      let tag = org.tags[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['slug'] = tag.slug;
      for (let y = 0; y < tag.tag_translations.length; y++) {
        allPaths.push({
          params: siteParams,
          locale: tag.tag_translations[y].locale_code,
        });
      }
    }
  }

  return allPaths;
}

export async function generateAllCategoryPagePaths(params = {}) {
  const { errors, data } = await listCategoryPagePaths(params);
  if (errors) {
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.categories.length; x++) {
      let category = org.categories[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['category'] = category.slug;
      for (let y = 0; y < category.category_translations.length; y++) {
        allPaths.push({
          params: siteParams,
          locale: category.category_translations[y].locale_code,
        });
      }
    }
  }

  return allPaths;
}

const HASURA_LIST_AUTHOR_PAGE_PATHS = `query FrontendListAuthorPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    authors(where: {published: {_eq: true}}) {
      id
      slug
      author_translations {
        locale_code
        title
      }
    }
  }
}`;

export async function listAuthorPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_AUTHOR_PAGE_PATHS,
    name: 'FrontendListAuthorPagePaths',
  });
}
export async function generateAllAuthorPagePaths(params = {}) {
  const { errors, data } = await listAuthorPagePaths(params);
  if (errors) {
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.authors.length; x++) {
      let author = org.authors[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['slug'] = author.slug;
      for (let y = 0; y < author.author_translations.length; y++) {
        allPaths.push({
          params: siteParams,
          locale: author.author_translations[y].locale_code,
        });
      }
    }
  }

  return allPaths;
}

const HASURA_LIST_NEWSLETTER_PAGE_PATHS = `query FrontendListNewsletterPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    newsletter_editions(order_by: {newsletter_published_at: desc}) {
      byline
      content
      headline
      newsletter_published_at
      slug
      subheadline
    }
  }
}`;

export async function listNewsletterPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_NEWSLETTER_PAGE_PATHS,
    name: 'FrontendListNewsletterPagePaths',
  });
}

export async function generateAllNewsletterPagePaths(params = {}) {
  const { errors, data } = await listNewsletterPagePaths(params);
  if (errors) {
    console.error('generateAllNewsletterPagePaths errors:', errors);
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.newsletter_editions.length; x++) {
      let newsletter = org.newsletter_editions[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['slug'] = newsletter.slug;
      allPaths.push({
        params: siteParams,
        locale: 'en-US',
      });
    }
  }

  return allPaths;
}

const HASURA_LIST_ALL_ARTICLE_ARCHIVE_PAGES = `query FrontendPaginatedListArticlesArchivePages {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    articles_aggregate(where: {article_translations: {published: {_eq: true}}}) {
      aggregate {
        count
      }
    }
  }
}`;

export async function listArticleArchivePages(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_ALL_ARTICLE_ARCHIVE_PAGES,
    name: 'FrontendPaginatedListArticlesArchivePages',
  });
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
export async function generateAllArticlePagePaths(params = {}) {
  const { errors, data } = await hasuraListAllArticleSlugs();
  if (errors) {
    throw errors;
  }
  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.articles.length; x++) {
      let article = org.articles[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['category'] = article.category.slug;
      siteParams['slug'] = article.slug;

      for (let y = 0; y < article.article_translations.length; y++) {
        let translation = article.article_translations[y];
        allPaths.push({
          params: siteParams,
          locale: translation.locale_code,
        });
      }
    }
  }
  return allPaths;
}
export async function generateAllArticlePreviewPagePaths(params = {}) {
  const { errors, data } = await hasuraListAllArticlePreviewSlugs();
  if (errors) {
    throw errors;
  }
  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.articles.length; x++) {
      let article = org.articles[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['category'] = article.category.slug;
      siteParams['slug'] = article.slug;

      for (let y = 0; y < article.article_translations.length; y++) {
        let translation = article.article_translations[y];
        allPaths.push({
          params: siteParams,
          locale: translation.locale_code,
        });
      }
    }
  }
  return allPaths;
}

export async function generateAllArticleArchivePages(params = {}) {
  const { errors, data } = await listArticleArchivePages(params);
  if (errors) {
    console.error('generateAllNewsletterPagePaths errors:', errors);
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    let siteParams = Object.assign({}, params['urlParams']);
    if (org.subdomain) {
      siteParams['site'] = org.subdomain;
    } else if (org.customDomain) {
      siteParams['site'] = org.customDomain;
    }

    let limit = 10;
    let totalCount = org.articles_aggregate.aggregate.count;
    let pageCount = Math.ceil(totalCount / limit);

    let pageNumbers = range(pageCount, 1);
    let paths = [];
    for (const pageNum of pageNumbers) {
      siteParams['pageNumber'] = pageNum.toString();

      paths.push({
        params: {
          params: siteParams,
          locale: 'en-US',
        },
      });
    }
  }

  return allPaths;
}

const LIST_SETTINGS = `query FrontendGetOrgSettings {
  settings {
    name
    value
  }
  organization_locales {
    locale {
      code
    }
  }
}`;

export async function getOrgSettings(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: process.env.HASURA_ADMIN_SECRET,
    site: params['site'],
    query: LIST_SETTINGS,
    name: 'FrontendGetOrgSettings',
  });
}
