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
