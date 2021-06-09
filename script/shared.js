const fetch = require("node-fetch");

const INSERT_DATA_IMPORT = `mutation FrontendInsertDataImport($notes: String, $end_date: date, $start_date: date, $table_name: String) {
  insert_ga_data_imports_one(object: {end_date: $end_date, notes: $notes, start_date: $start_date, table_name: $table_name}) {
    id
    notes
    end_date
    created_at
    organization_id
    start_date
    table_name
    updated_at
  }
}`;

function hasuraInsertDataImport(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: INSERT_DATA_IMPORT,
    name: 'FrontendInsertDataImport',
    variables: {
      notes: params['notes'],
      end_date: params['end_date'],
      start_date: params['start_date'],
      table_name: params['table_name'],
    },
  });
}

const HASURA_INSERT_DONATION_CLICK_DATA = `mutation FrontendInsertDonationClick($action: String!, $date: date!, $count: Int!, $path: String!) {
  insert_ga_donation_clicks_one(object: {action: $action, date: $date, count: $count, path: $path}, on_conflict: {constraint: ga_donation_impressions_organization_id_path_date_action_key, update_columns: count}) {
    action
    created_at
    date
    id
    count
    organization_id
    path
    updated_at
  }
}`;

function hasuraInsertDonationClick(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_DONATION_CLICK_DATA,
    name: 'FrontendInsertDonationClick',
    variables: {
      action: params['action'],
      date: params['date'],
      count: params['count'],
      path: params['path'],
    },
  });
}

const INSERT_ORGANIZATION_MUTATION = `mutation FrontendInsertOrganization($slug: String = "", $name: String = "") {
  insert_organizations_one(object: {name: $name, slug: $slug}) {
    id
    name
    slug
  }
}`;

function hasuraInsertOrganization(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: INSERT_ORGANIZATION_MUTATION,
    name: 'FrontendInsertOrganization',
    variables: {
      name: params['name'],
      slug: params['slug'],
    },
  });
}

const INSERT_ORG_LOCALES_MUTATION = `mutation FrontendInsertOrgLocales($objects: [organization_locales_insert_input!]!)
 {
  insert_organization_locales(
    objects: $objects
  ) {
    affected_rows
  }
}`

function hasuraInsertOrgLocales(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: INSERT_ORG_LOCALES_MUTATION,
    name: 'FrontendInsertOrgLocales',
    variables: {"objects": params['orgLocales']}
  });
}

const HASURA_UPSERT_METADATA = `mutation FrontendUpsertMetadata($published: Boolean, $data: jsonb, $locale_code: String, $organization_id: Int!) {
  insert_site_metadatas(objects: {organization_id: $organization_id, published: $published, site_metadata_translations: {data: {data: $data, locale_code: $locale_code}, on_conflict: {constraint: site_metadata_translations_locale_code_site_metadata_id_key, update_columns: data}}}, on_conflict: {constraint: site_metadatas_organization_id_key, update_columns: published}) {
    returning {
      id
      published
    }
  }
}`;

function hasuraUpsertMetadata(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_UPSERT_METADATA,
    name: 'FrontendUpsertMetadata',
    variables: {
      organization_id: params['organization_id'],
      data: params['data'],
      published: params['published'],
      locale_code: params['locale_code']
    },
  });
}

const HASURA_REMOVE_ORGANIZATION = `mutation FrontendRemoveOrganization($slug: String!) {
    delete_organization_locales(where: {organization: {slug: {_eq: $slug}}}) {
      affected_rows
    }
    delete_category_translations(where: {category: {organization: {slug: {_eq: $slug}}}}) {
      affected_rows
    }
    delete_categories(where: {organization: {slug: {_eq: $slug}}}) {
      affected_rows
    }
    delete_site_metadata_translations(where: {site_metadata: {organization: {slug: {_eq: $slug}}}}) {
      affected_rows
    }
    delete_site_metadatas(where: {organization: {slug: {_eq: $slug}}}) {
      affected_rows
    }
    delete_homepage_layout_schemas(where: {organization: {slug: {_eq: $slug}}}) {
      affected_rows
    }
    delete_organizations(where: {slug: {_eq: $slug}}) {
      affected_rows
    }  
}`;

function hasuraRemoveOrganization(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_REMOVE_ORGANIZATION,
    name: 'FrontendRemoveOrganization',
    variables: {
      slug: params['slug'],
    },
  });
}

const HASURA_UPSERT_LAYOUT = `mutation FrontendUpsertLayout($organization_id: Int!, $name: String!, $data: jsonb!) {
  insert_homepage_layout_schemas(objects: {name: $name, data: $data, organization_id: $organization_id}, on_conflict: {constraint: homepage_layout_schemas_name_organization_id_key, update_columns: [name, data]}) {
    returning {
      id
      name
    }
  }
}`;

function hasuraUpsertHomepageLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_UPSERT_LAYOUT,
    name: 'FrontendUpsertLayout',
    variables: {
      organization_id: params['organization_id'],
      name: params['name'],
      data: params['data'],
    },
  });
}

const HASURA_INSERT_SECTIONS = `mutation FrontendInsertSections($objects: [categories_insert_input!]!) {
  insert_categories(objects: $objects, on_conflict: {constraint: categories_organization_id_slug_key, update_columns: [slug, published]}) {
    returning {
      id
      slug
      published
    }
  }
}`;

function hasuraInsertSections(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_INSERT_SECTIONS,
    name: 'FrontendInsertSections',
    variables: {
      objects: params['objects']
    }
  });
}

const HASURA_LIST_TAGS = `query FrontendListTags {
  tags(where: {published: {_eq: true}}) {
    slug
    tag_translations {
      locale_code
      title
    }
  }
}`;

function hasuraListTags(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_TAGS,
    name: 'FrontendListTags',
  });
}

const HASURA_LIST_SECTIONS = `query FrontendListSections {
  categories(where: {published: {_eq: true}}) {
    slug
    category_translations {
      title
      locale_code
    }
  }
}`;

function hasuraListSections(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_SECTIONS,
    name: 'FrontendListSections',
  });
}

const HASURA_LIST_ALL_LOCALES = `query FrontendListAllLocales {
  locales {
    id
    code
    name
  }
}`;

function hasuraListAllLocales(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_ALL_LOCALES,
    name: 'FrontendListAllLocales'
  });
}
const HASURA_LIST_ORG_LOCALES = `query FrontendListOrgLocales {
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
    name: 'FrontendListOrgLocales',
  });
}

const HASURA_LIST_ORGANIZATIONS = `query FrontendListOrganizations {
  organizations {
    created_at
    id
    name
    slug
    organization_locales {
      locale {
        code
      }
    }
  }
}`;

function hasuraListOrganizations(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_ORGANIZATIONS,
    name: 'FrontendListOrganizations',
  });
}


const HASURA_INSERT_PAGE_VIEW_DATA = `mutation FrontendInsertPageView($count: Int!, $date: date!, $path: String!) {
  insert_ga_page_views_one(object: {count: $count, date: $date, path: $path}, on_conflict: {constraint: ga_page_views_organization_id_date_path_key, update_columns: count}) {
    updated_at
    id
    path
    created_at
    count
    date
    organization_id
  }
}`;

function hasuraInsertPageView(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_PAGE_VIEW_DATA,
    name: 'FrontendInsertPageView',
    variables: {
      count: params['count'],
      date: params['date'],
      path: params['path'],
    },
  });
}

const HASURA_INSERT_GEO_SESSION_DATA = `mutation FrontendInsertGeoSession($count: Int!, $date: date!, $region: String!) {
  insert_ga_geo_sessions_one(object: {region: $region, count: $count, date: $date}, on_conflict: {constraint: ga_geo_sessions_organization_id_date_region_key, update_columns: count}) {
    updated_at
    id
    created_at
    region
    count
    date
    organization_id
  }
}`;

function hasuraInsertGeoSession(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_GEO_SESSION_DATA,
    name: 'FrontendInsertGeoSession',
    variables: {
      count: params['count'],
      region: params['region'],
      date: params['date'],
    },
  });
}

const HASURA_INSERT_SESSION_DATA = `mutation FrontendInsertSession($count: Int!, $date: date!) {
  insert_ga_sessions_one(object: {count: $count, date: $date}, on_conflict: {constraint: ga_sessions_organization_id_date_key, update_columns: count}) {
    updated_at
    id
    created_at
    count
    date
    organization_id
  }
}`;

function hasuraInsertSession(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_SESSION_DATA,
    name: 'FrontendInsertSession',
    variables: {
      count: params['count'],
      date: params['date'],
    },
  });
}

const HASURA_INSERT_DONOR_READING_FREQUENCY = `mutation FrontendInsertDonorFrequency($count: Int!, $label: String!, $date: date!) {
  insert_ga_donor_reading_frequency_one(object: {count: $count, label: $label, date: $date}, on_conflict: {constraint: ga_donor_reading_frequency_organization_id_label_date_key, update_columns: count}) {
    updated_at
    id
    created_at
    count
    date
    label
  }
}`;

function hasuraInsertDonorReadingFrequency(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_DONOR_READING_FREQUENCY,
    name: 'FrontendInsertDonorFrequency',
    variables: {
      count: params['count'],
      label: params['label'],
      date: params['date'],
    },
  });
}

const HASURA_INSERT_SESSION_DURATION_DATA = `mutation FrontendInsertSessionDuration($seconds: float8!, $date: date!) {
  insert_ga_session_duration_one(object: {seconds: $seconds, date: $date}, on_conflict: {constraint: ga_session_duration_organization_id_date_key, update_columns: seconds}) {
    updated_at
    id
    created_at
    seconds
    date
    organization_id
  }
}`;

function hasuraInsertSessionDuration(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_SESSION_DURATION_DATA,
    name: 'FrontendInsertSessionDuration',
    variables: {
      seconds: params['seconds'],
      date: params['date'],
    },
  });
}

const HASURA_INSERT_NEWSLETTER_IMPRESSION_DATA = `mutation FrontendInsertNewsletterImpression($action: String!, $date: date!, $impressions: Int!, $path: String!) {
  insert_ga_newsletter_impressions_one(object: {action: $action, date: $date, impressions: $impressions, path: $path}, on_conflict: {constraint: ga_newsletter_impressions_organization_id_path_action_date_key, update_columns: impressions}) {
    action
    created_at
    date
    id
    impressions
    organization_id
    path
    updated_at
  }
}`;

function hasuraInsertNewsletterImpression(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_NEWSLETTER_IMPRESSION_DATA,
    name: 'FrontendInsertNewsletterImpression',
    variables: {
      action: params['action'],
      date: params['date'],
      impressions: params['impressions'],
      path: params['path'],
    },
  });
}

const HASURA_INSERT_CUSTOM_DIMENSION_DATA = `mutation FrontendInsertCustomDimension($count: Int!, $date: date!, $dimension: String!, $label: String!) {
  insert_ga_custom_dimensions_one(object: {count: $count, date: $date, dimension: $dimension, label: $label}, on_conflict: {constraint: ga_events_organization_id_dimension_date_label_key, update_columns: count}) {
    count
    created_at
    date
    dimension
    id
    label
    organization_id
    updated_at
  }
}`;

function hasuraInsertCustomDimension(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_CUSTOM_DIMENSION_DATA,
    name: 'FrontendInsertCustomDimension',
    variables: {
      count: params['count'],
      date: params['date'],
      dimension: params['dimension'],
      label: params['label'],
    },
  });
}

const HASURA_INSERT_READING_FREQUENCY_DATA = `mutation FrontendInsertReadingFrequency($objects: [ga_reading_frequency_insert_input!]!) {
  insert_ga_reading_frequency(objects: $objects, on_conflict: {constraint: ga_reading_frequency_organization_id_date_category_key, update_columns: count}) {
    affected_rows
    returning {
      id
      date
      category
      count
    }
  }
}`;

function hasuraInsertReadingFrequency(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_READING_FREQUENCY_DATA,
    name: 'FrontendInsertReadingFrequency',
    variables: {
      objects: params['objects'],
    },
  });
}

const HASURA_INSERT_REFERRAL_SESSION_DATA = `mutation FrontendInsertReferralSession($count: Int!, $date: date!, $source: String!) {
  insert_ga_referral_sessions_one(object: {source: $source, count: $count, date: $date}, on_conflict: {constraint: ga_referral_sessions_organization_id_date_source_key, update_columns: count}) {
    updated_at
    id
    created_at
    source
    count
    date
    organization_id
  }
}`;

function hasuraInsertReferralSession(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_REFERRAL_SESSION_DATA,
    name: 'FrontendInsertReferralSession',
    variables: {
      count: params['count'],
      source: params['source'],
      date: params['date'],
    },
  });
}

const HASURA_INSERT_READING_DEPTH_DATA = `mutation FrontendInsertReadingDepth($date: date!, $path: String!, $read_100: float8!, $read_25: float8!, $read_50: float8!, $read_75: float8!) {
  insert_ga_reading_depth_one(object: {path: $path, date: $date, read_25: $read_25, read_50: $read_50, read_75: $read_75, read_100: $read_100}, on_conflict: {constraint: ga_reading_depth_organization_id_date_path_key, update_columns: [read_25, read_50, read_75, read_100]}) {
    id
    date
    organization_id
    path
    read_100
    read_25
    read_50
    read_75
    updated_at
    created_at
  }
}`;

function hasuraInsertReadingDepth(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_READING_DEPTH_DATA,
    name: 'FrontendInsertReadingDepth',
    variables: {
      date: params['date'],
      path: params['path'],
      read_25: params['read_25'],
      read_50: params['read_50'],
      read_75: params['read_75'],
      read_100: params['read_100'],
    },
  });
}

const HASURA_DELETE_ANALYTICS = `mutation FrontendDeleteAnalytics {
  delete_ga_data_imports(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_custom_dimensions(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_donor_reading_frequency(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_geo_sessions(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_newsletter_impressions(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_page_views(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_reading_depth(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_reading_frequency(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_referral_sessions(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_session_duration(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_ga_sessions(where: {id: {_gt: 0}}) {
    affected_rows
  }
}`;

function hasuraDeleteAnalytics(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_DELETE_ANALYTICS,
    name: 'FrontendDeleteAnalytics',
  })
}

async function fetchGraphQL(params) {
  let url;
  let orgSlug;
  if (!params.hasOwnProperty('url')) {
    url = HASURA_API_URL;
  } else {
    url = params['url'];
  }

  let requestHeaders;

  if (params.hasOwnProperty('orgSlug')) {
    orgSlug = params['orgSlug'];
    requestHeaders = {
      'TNC-Organization': orgSlug
    };
  } else if (params.hasOwnProperty('adminSecret')) {
    requestHeaders = {
      "x-hasura-admin-secret": params['adminSecret']
    };
  }

  let operationQuery = params['query'];
  let operationName = params['name'];
  let variables = params['variables'];

  const result = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({
      query: operationQuery,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

function sanitizePath(path) {
  if (/\?/.test(path)) {
    path = path.split('?')[0];
  }
  if (/\/en-US\//.test(path)) {
    path = path.replace('/en-US', '');
  }
  return path;
}

module.exports = {
  hasuraInsertOrganization,
  hasuraInsertOrgLocales,
  hasuraInsertPageView,
  hasuraInsertSession,
  hasuraInsertSessionDuration,
  hasuraInsertGeoSession,
  hasuraInsertReferralSession,
  hasuraInsertReadingDepth,
  hasuraInsertReadingFrequency,
  hasuraInsertCustomDimension,
  hasuraInsertNewsletterImpression,
  hasuraListAllLocales,
  hasuraListLocales,
  hasuraListOrganizations,
  hasuraListSections,
  hasuraListTags,
  hasuraUpsertHomepageLayout,
  hasuraUpsertMetadata,
  hasuraInsertSections,
  hasuraInsertDataImport,
  hasuraRemoveOrganization,
  hasuraDeleteAnalytics,
  hasuraInsertDonationClick,
  hasuraInsertDonorReadingFrequency,
  fetchGraphQL,
  sanitizePath
}