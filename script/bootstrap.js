#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const fetch = require("node-fetch");

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

const HASURA_LIST_ORG_LOCALES = `query MyQuery {
  organization_locales {
    locale {
      code
    }
  }
}`;
function hasuraListLocales(params) {
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

const HASURA_UPSERT_SECTION = `mutation MyMutation($locale_code: String!, $title: String!, $slug: String!, $published: Boolean) {
  insert_categories(objects: {slug: $slug, category_translations: {data: {locale_code: $locale_code, title: $title}, on_conflict: {constraint: category_translations_locale_code_category_id_key, update_columns: [title]}}, published: $published}, on_conflict: {constraint: categories_organization_id_slug_key, update_columns: [slug, published]}) {
    returning {
      id
      slug
      published
    }
  }
}`;
async function fetchGraphQL(params) {
  let url;
  let orgSlug;
  if (!params.hasOwnProperty('url')) {
    url = HASURA_API_URL;
  } else {
    url = params['url'];
  }
  if (!params.hasOwnProperty('orgSlug')) {
    orgSlug = ORG_SLUG;
  } else {
    orgSlug = params['orgSlug'];
  }
  let operationQuery = params['query'];
  let operationName = params['name'];
  let variables = params['variables'];

  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'TNC-Organization': orgSlug,
    },
    body: JSON.stringify({
      query: operationQuery,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}
function hasuraUpsertSection(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_SECTION,
    name: 'MyMutation',
    variables: {
      locale_code: params['localeCode'],
      slug: params['slug'],
      published: params['published'],
      title: params['title'],
    },
  });
}
async function createGeneralNewsCategory() {
  const localeResult = await hasuraListLocales({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let locales;
  if (localeResult.errors) {
    console.error("Error listing locales:", localeResult.errors);
  } else {
    locales = localeResult.data.organization_locales;
  }

  for (var i = 0; i < locales.length; i++) {
    let locale = locales[i].locale.code;
    const { errors, data } = await hasuraUpsertSection({
      url: apiUrl,
      orgSlug: apiToken,
      title: "News",
      slug: "news",
      localeCode: locale,
      published: true
    })

    if (errors) {
      console.error("Error creating general news category:", errors);
    } else {
      console.log("Created general news category:", locale, data.insert_categories.returning);
    }
  }
}

const HASURA_UPSERT_LAYOUT = `mutation MyMutation($name: String!, $data: jsonb!) {
  insert_homepage_layout_schemas(objects: {name: $name, data: $data}, on_conflict: {constraint: homepage_layout_schemas_name_organization_id_key, update_columns: [name, data]}) {
    returning {
      id
      name
    }
  }
}`;

function hasuraUpsertHomepageLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_LAYOUT,
    name: 'MyMutation',
    variables: {
      name: params['name'],
      data: params['data'],
    },
  });
}

async function createHomepageLayout1() {
  const { errors, data } = await hasuraUpsertHomepageLayout({
    url: apiUrl,
    orgSlug: apiToken,
    name: "Large Package Story Lead",
    data: "{ \"subfeatured-top\":\"string\", \"subfeatured-bottom\":\"string\", \"featured\":\"string\" }"
  })

  if (errors) {
    console.error("Error creating large package story layout:", errors);
  } else {
    console.log("Created large package story layout:", data);
  }
}

async function createHomepageLayout2() {
  const { errors, data } = await hasuraUpsertHomepageLayout({
    url: apiUrl,
    orgSlug: apiToken,
    name: "Big Featured Story",
    data: "{ \"featured\":\"string\" }"
  })

  if (errors) {
    console.error("Error creating big featured story layout:", errors);
  } else {
    console.log("Created big featured story layout:", data);
  }
}


const HASURA_UPSERT_METADATA = `mutation MyMutation($published: Boolean, $data: jsonb, $locale_code: String) {
  insert_site_metadatas(objects: {published: $published, site_metadata_translations: {data: {data: $data, locale_code: $locale_code}, on_conflict: {constraint: site_metadata_translations_locale_code_site_metadata_id_key, update_columns: data}}}, on_conflict: {constraint: site_metadatas_organization_id_key, update_columns: published}) {
    returning {
      id
      published
    }
  }
}`;

function hasuraUpsertMetadata(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_METADATA,
    name: 'MyMutation',
    variables: {
      data: params['data'],
      published: params['published'],
      locale_code: params['localeCode']
    },
  });
}

async function createMetadata() {
  const data = {
    "shortName": "The New Oaklyn Observer",
    "siteUrl": "https://tinynewsco.org/",
    "homepageTitle": "The New Oaklyn Observer",
    "homepageSubtitle": "a new local news initiative",
    "subscribe": "{\"title\":\"Subscribe\",\"subtitle\":\"Get the latest news from Oaklyn in your inbox.\"}",
    "footerTitle": "tinynewsco.org",
    "footerBylineName": "News Catalyst",
    "footerBylineLink": "https://newscatalyst.org",
    "labels": "{\"latestNews\":\"Latest News\",\"search\":\"Search\",\"topics\":\"Topics\"}",
    "nav": "{\"articles\":\"Articles\",\"topics\":\"All Topics\",\"cms\":\"tinycms\"}",
    "searchTitle": "The Oaklyn Observer",
    "searchDescription": "Page description",
    "facebookTitle": "Facebook title",
    "facebookDescription": "Facebook description",
    "twitterTitle": "Twitter title",
    "twitterDescription": "Twitter description",
    "aboutHed": "Who We Are",
    "aboutDek": "We’re journalists for Oaklyn. We amplify community voices, share information resources, and investigate systems, not just symptoms.",
    "aboutCTA": "Learn more",
    "supportHed": "Support our work",
    "supportDek": "The Oaklyn Observer exists based on the support of our readers. Chip in today to help us continue serving Oaklyn with quality journalism.",
    "supportCTA": "Donate",
    "theme": "styleone",
    "color": "colorone",
  };

  const localeResult = await hasuraListLocales({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let locales;
  if (localeResult.errors) {
    console.error("Error listing locales:", localeResult.errors);
  } else {
    locales = localeResult.data.organization_locales;
  }

  for (var i = 0; i < locales.length; i++) {
    let locale = locales[i].locale.code;
    let result = await hasuraUpsertMetadata({
      url: apiUrl,
      orgSlug: apiToken,
      data: data,
      published: true,
      localeCode: locale
    });

    if (result.errors) {
      console.error("Error creating site metadata:", result.errors);
    } else {
      console.log("Successfully created site metadata in locale", locale);
    }
  }
}

async function main() {
  createGeneralNewsCategory();
  createHomepageLayout1();
  createHomepageLayout2();
  createMetadata();
}

main().catch((error) => console.error(error));
