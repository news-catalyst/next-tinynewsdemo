import { fetchGraphQL } from './graphql';

export const HASURA_LIST_NEWSLETTERS = `query FrontendListNewsletterEditions($locale_code: String!) {
  newsletter_editions(order_by: {newsletter_published_at: desc}) {
    byline
    content
    headline
    newsletter_published_at
    slug
    subheadline
  }
  categories {
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
    published
    slug
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
  tags(where: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      locale_code
      title
    }
  }
}`;

export function hasuraListNewsletters(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_LIST_NEWSLETTERS,
    name: 'FrontendListNewsletterEditions',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

export const HASURA_GET_NEWSLETTER = `query FrontendGetNewsletter($slug: String!, $locale_code: String!) {
  newsletter_editions(where: {slug: {_eq: $slug}}) {
    byline
    content
    headline
    newsletter_published_at
    slug
    subheadline
  }
  categories {
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
    published
    slug
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
  tags(where: {published: {_eq: true}, tag_translations: {}}) {
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
  }
}`;

export function hasuraGetNewsletter(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_NEWSLETTER,
    name: 'FrontendGetNewsletter',
    variables: {
      locale_code: params['localeCode'],
      slug: params['slug'],
    },
  });
}
