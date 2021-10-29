import { fetchGraphQL } from './utils';

export const HASURA_LIST_NEWSLETTERS = `query FrontendListNewsletterEditions {
  newsletter_editions(order_by: {newsletter_published_at: desc}) {
    byline
    content
    headline
    newsletter_published_at
    slug
    subheadline
  }
  categories {
    category_translations {
      title
      locale_code
    }
    published
    slug
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

export function hasuraListNewsletters(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_NEWSLETTERS,
    name: 'FrontendListNewsletterEditions',
    variables: {
      locale_code: params['locale_code'],
    },
  });
}

export const HASURA_GET_NEWSLETTER = `query FrontendGetNewsletter($locale_code: String!, $slug: String!) {
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
  tags(where: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    tag_translations {
      title
    }
  }
}`;

export function hasuraGetNewsletter(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_NEWSLETTER,
    name: 'FrontendGetNewsletter',
    variables: {
      locale_code: params['locale_code'],
      slug: params['slug'],
    },
  });
}
