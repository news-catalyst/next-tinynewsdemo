import { fetchGraphQL } from './graphql';

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

export function findSetting(settings, name) {
  try {
    let item = settings.find((setting) => setting.name === name);
    return item.value;
  } catch (err) {
    console.error(`Error finding setting ${name}:`, err);
  }
}

export function booleanSetting(items, name, defaultValue) {
  let setting = items.find((item) => item.name === name);
  if (setting) {
    return setting.value;
  }
  return defaultValue;
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

export async function generateAllDomainPaths(params) {
  const { errors, data } = await listDomains(params);
  if (errors) {
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

    // trying without locale - debugging 404 en-US Vercel Platforms rollout
    allPaths.push({
      params: siteParams,
    });
  }

  return allPaths;
}

const HASURA_GET_LAYOUT = `query FrontendGetLayout($locale_code: String!) {
  categories {
    slug
    published
    category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
    }
  }
  site_metadatas(where: {published: {_eq: true}, site_metadata_translations: {locale_code: {_eq: $locale_code}}}) {
    site_metadata_translations(order_by: {id: desc}, limit: 1, where: {locale_code: {_eq: $locale_code}}) {
      data
    }
  }
}`;

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
