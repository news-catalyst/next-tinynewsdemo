import { fetchGraphQL } from './graphql';

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

export const HASURA_GET_NEWSLETTER = `query FrontendGetNewsletter($slug: String!) {
  newsletter_editions(where: {slug: {_eq: $slug}}) {
    byline
    content
    headline
    newsletter_published_at
    slug
    subheadline
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
  tags(where: {published: {_eq: true}, tag_translations: {}}) {
    slug
    tag_translations {
      title
      locale_code
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
      slug: params['slug'],
    },
  });
}
