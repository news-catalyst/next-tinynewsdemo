import { fetchGraphQL } from './graphql';

// The amount of newsletters to display on each page
export const NEWSLETTER_ARCHIVE_PAGINATION_SIZE = 10;

export const HASURA_LIST_NEWSLETTERS = `query FrontendListNewsletterEditions($limit: Int, $offset: Int, $locale_code: String!) {
  newsletter_editions_aggregate {
    aggregate {
      count
    }
  }
  newsletter_editions(limit: $limit, offset: $offset, order_by: {newsletter_published_at: desc}) {
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
}`;

export function hasuraListNewsletters(params) {
  let limit = parseInt(params['limit'] || NEWSLETTER_ARCHIVE_PAGINATION_SIZE);
  let offset = parseInt(params['offset'] || '0');

  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_LIST_NEWSLETTERS,
    name: 'FrontendListNewsletterEditions',
    variables: {
      limit: limit,
      offset: offset,
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

export async function generateAllNewsletterPaths(params = {}) {
  const { errors, data } = await listNewsletterPagePaths(params);
  if (errors) {
    console.error('generateAllNewsletterPaths errors:', errors);
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
      });
    }
  }

  return allPaths;
}

// Creates all static paths to newsletter archive pages for all sites
export async function generateAllNewsletterArchivePaths(params = {}) {
  const { errors, data } = await listNewsletterArchivePages(params);
  if (errors) {
    console.error('errors:', errors);
    throw errors;
  }

  let allPaths = [];
  data.organizations.forEach((org) => {
    let totalCount = org.newsletter_editions_aggregate.aggregate.count;
    let pageCount = Math.ceil(totalCount / NEWSLETTER_ARCHIVE_PAGINATION_SIZE);

    let siteParams = Object.assign({}, params['urlParams']);
    if (org.subdomain) {
      siteParams['site'] = org.subdomain;
    } else if (org.customDomain) {
      siteParams['site'] = org.customDomain;
    }

    for (let i = 1; i < pageCount + 1; i++) {
      siteParams['pageNumber'] = i.toString();

      allPaths.push({
        params: siteParams,
      });
    }
  });
  return allPaths;
}

const HASURA_LIST_ALL_PAGINATED_NEWSLETTER_PAGES = `query FrontendPaginatedListNewsletterPages {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    newsletter_editions_aggregate {
      aggregate {
        count
      }
    }
  }
}`;

export async function listNewsletterArchivePages(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_ALL_PAGINATED_NEWSLETTER_PAGES,
    name: 'FrontendPaginatedListNewsletterPages',
  });
}
