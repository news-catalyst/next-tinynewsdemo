const fetch = require('node-fetch');
const faker = require('faker');

const INSERT_LOCALE = `mutation FrontendInsertLocale($code: String!, $name: String!) {
  insert_locales_one(object: {code: $code, name: $name}, on_conflict: {constraint: locales_code_key, update_columns: code}) {
    id
  }
}`;

function hasuraInsertLocale(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: INSERT_LOCALE,
    name: 'FrontendInsertLocale',
    variables: {
      code: params['code'],
      name: params['name'],
    },
  });
}

const INSERT_NEWSLETTER_EDITION = `mutation FrontendInsertNewsletterEdition($slug: String, $byline: String, $content: jsonb, $headline: String, $letterhead_id: Int, $letterhead_unique_id: String, $newsletter_created_at: timestamptz, $newsletter_published_at: timestamptz, $subheadline: String) {
  insert_newsletter_editions_one(object: {slug: $slug, byline: $byline, content: $content, headline: $headline, letterhead_id: $letterhead_id, letterhead_unique_id: $letterhead_unique_id, newsletter_created_at: $newsletter_created_at, newsletter_published_at: $newsletter_published_at, subheadline: $subheadline}, on_conflict: {constraint: newsletter_editions_organization_id_letterhead_unique_id_key, update_columns: headline}) {
    id
    headline
    slug
  }
}`;

function hasuraInsertNewsletterEdition(params) {
  console.log(params);
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: INSERT_NEWSLETTER_EDITION,
    name: 'FrontendInsertNewsletterEdition',
    variables: {
      byline: params['data']['byline'],
      slug: params['data']['slug'],
      content: params['data']['content'],
      headline: params['data']['headline'],
      letterhead_id: params['data']['letterhead_id'],
      letterhead_unique_id: params['data']['letterhead_unique_id'],
      newsletter_created_at: params['data']['newsletter_created_at'],
      newsletter_published_at: params['data']['newsletter_published_at'],
      subheadline: params['data']['subheadline'],
    },
  });
}

const INSERT_DATA_IMPORT = `mutation FrontendInsertDataImport($notes: String, $end_date: date, $start_date: date, $table_name: String, $success: Boolean, $row_count: Int) {
  insert_ga_data_imports_one(object: {end_date: $end_date, notes: $notes, start_date: $start_date, table_name: $table_name, success: $success, row_count: $row_count}) {
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
      success: params['success'],
      row_count: params['row_count'],
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
  insert_organizations_one(object: {name: $name, slug: $slug}, on_conflict: {constraint: organizations_slug_key, update_columns: [name,slug]}) {
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
}`;

function hasuraInsertOrgLocales(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: INSERT_ORG_LOCALES_MUTATION,
    name: 'FrontendInsertOrgLocales',
    variables: { objects: params['orgLocales'] },
  });
}

const INSERT_ADMIN_LOCALES_MUTATION = `mutation AdminInsertLocales($objects: [locales_insert_input!] = {}) {
  insert_locales(objects: $objects, on_conflict: {constraint: locales_code_key, update_columns: name}) {
    affected_rows
  }
}`;

function hasuraAdminInsertLocales(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: INSERT_ADMIN_LOCALES_MUTATION,
    name: 'AdminInsertLocales',
    variables: { objects: params['locales'] },
  });
}

const HASURA_UPSERT_METADATA = `mutation FrontendUpsertMetadata($published: Boolean, $data: jsonb, $locale_code: String, $organization_id: Int!) {
  insert_site_metadatas(objects: {
    organization_id: $organization_id, published: $published, 
    site_metadata_translations: {
      data: {
        data: $data, 
        locale_code: $locale_code
      }, 
      on_conflict: {
        constraint: site_metadata_translations_locale_code_site_metadata_id_key, 
        update_columns: data
      }
    }
  }, on_conflict: {constraint: site_metadatas_organization_id_key, update_columns: published}) {
    returning {
      id
      published
    }
  }
}`;

function hasuraUpsertMetadata(params) {
  // console.log('upsert metadata:', params);
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_UPSERT_METADATA,
    name: 'FrontendUpsertMetadata',
    variables: {
      organization_id: params['organization_id'],
      data: params['data'],
      published: params['published'],
      locale_code: params['locale_code'],
    },
  });
}

const HASURA_REMOVE_ORGANIZATION = `mutation FrontendRemoveOrganization($slug: String!) {
  delete_category_translations(where: {category: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  
  delete_page_google_documents(where: {page: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_page_slug_versions(where: {page: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_page_translations(where: {page: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_published_article_translations(where: {article: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_article_slug_versions(where: {article: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_homepage_layout_datas(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_author_translations(where: {author: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_homepage_layout_schemas(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_author_articles(where: {author: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_tag_translations(where: {tag: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_tag_articles(where: {tag: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_tags(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_pages(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_article_translations(where: {article: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_article_google_documents(where: {google_document: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_articles(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_categories(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_authors(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_google_documents(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_organization_locales(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_site_metadata_translations(where: {site_metadata: {organization: {slug: {_eq: $slug}}}}) {
    affected_rows
  }
  delete_site_metadatas(where: {organization: {slug: {_eq: $slug}}}) {
    affected_rows
  }
  delete_organizations(where: {slug: {_eq: $slug}}) {
    affected_rows
  }
}`;

async function hasuraRemoveOrganization(params) {
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

const HASURA_CREATE_TAG = `mutation FrontendCreateTag($slug: String, $title: String, $locale_code: String) {
  insert_tags_one(object: {published: true, slug: $slug, tag_translations: {data: {title: $title, locale_code: $locale_code}}}) {
    id
  }
}`;

async function hasuraCreateOneTag(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_CREATE_TAG,
    name: 'FrontendCreateTag',
    variables: {
      slug: params['slug'],
      title: params['title'],
      locale_code: params['locale_code'],
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
      objects: params['objects'],
    },
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
    name: 'FrontendListAllLocales',
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

const HASURA_INSERT_ARTICLE_SESSION_DATA = `mutation FrontendInsertArticleSession($count: Int!, $date: date!, $path: String!, $category: String!, $document_type: String!) {
  insert_ga_article_sessions_one(object: {category: $category, count: $count, date: $date, document_type: $document_type, path: $path}, on_conflict: {constraint: ga_article_sessions_date_organization_id_path_key, update_columns: count}) {
    id
    created_at
    category
    count
    date
    document_type
    organization_id
    path
    updated_at
  }
}`;

function hasuraInsertArticleSession(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_ARTICLE_SESSION_DATA,
    name: 'FrontendInsertArticleSession',
    variables: {
      count: params['count'],
      date: params['date'],
      path: params['path'],
      category: params['category'],
      document_type: params['document_type'],
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
  });
}

const HASURA_GET_ARTICLES_RSS = `query FrontendGetArticlesRSS($locale_code: String!) {
  articles(limit: 10, order_by: {created_at: desc}, where: {article_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    article_translations(where: {locale_code: {_eq: $locale_code}, published: {_eq: true}}) {
      content
      custom_byline
      first_published_at
      headline
      last_published_at
      published
      search_description
      updated_at
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
    category {
      slug
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
      }
    }
  }
}`;

function hasuraGetArticlesRss(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_ARTICLES_RSS,
    name: 'FrontendGetArticlesRSS',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_GET_SITE_DATA = `query FrontendGetSiteData {
  articles(where: {article_translations: {published: {_eq: true}}}, order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}) {
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
      content
    }
    author_articles {
      author {
        first_names
        last_name
        photoUrl
        slug
        twitter
        author_translations {
          bio
          title
          locale_code
        }
      }
    }
    category {
      slug
      category_translations {
        locale_code
        title
      }
    }
  }
  categories(where: {published: {_eq: true}}) {
    slug
    category_translations {
      title
      locale_code
    }
  }
  pages(where: {page_translations: {published: {_eq: true}}}) {
    id
    author_pages {
      author {
        id
        first_names
        last_name
        slug
        photoUrl
        author_translations {
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
  organization_locales {
    locale {
      code
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
  site_metadatas(where: {published: {_eq: true}}) {
    site_metadata_translations {
      data
      locale_code
    }
  }
}`;
const HASURA_INSERT_ONE_AUTHOR = `mutation FrontendInsertAuthor($bio: String = "", $email: String = "", $first_names: String = "", $last_name: String = "", $slug: String = "", $title: String = "", $twitter: String = "") {
  insert_authors_one(on_conflict: {constraint: authors_slug_organization_id_key, update_columns: slug}, object: {bio: $bio, email: $email, first_names: $first_names, last_name: $last_name, published: true, slug: $slug, staff: true, title: $title, twitter: $twitter}) {
    id
  }
}`;

function hasuraInsertOneAuthor(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_ONE_AUTHOR,
    name: 'FrontendInsertAuthor',
    variables: {
      bio: params['bio'],
      email: params['email'],
      first_names: params['first_names'],
      last_name: params['last_name'],
      slug: params['slug'],
      title: params['title'],
      twitter: params['twitter'],
    },
  });
}

const HASURA_INSERT_GOOGLE_DOC = `mutation FrontendInsertGoogleDoc($document_id: String = "", $locale_code: String = "") {
  insert_google_documents_one(object: {document_id: $document_id, locale_code: $locale_code}) {
    id
  }
}`;

async function hasuraInsertGoogleDoc(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_GOOGLE_DOC,
    name: 'FrontendInsertGoogleDoc',
    variables: {
      document_id: params['document_id'],
      locale_code: params['locale_code'],
    },
  });
}

const HASURA_INSERT_TEST_ARTICLE = `mutation FrontendInsertArticle($google_document_id: Int, $category_id: Int, $slug: String, $content: jsonb, $headline: String, $search_title: String, $search_description: String, $locale_code: String, $author_id: Int, $tag_id: Int) {
  insert_articles_one(
    object: {
      article_google_documents: {
        data: {
          google_document_id: $google_document_id
        }, 
        on_conflict: {
          constraint: article_google_documents_article_id_google_document_id_key, update_columns: google_document_id
        }
      }, 
      category_id: $category_id, 
      slug: $slug, 
    article_translations: {
      data: {
        content: $content, headline: $headline, published: true, search_title: $search_title, search_description: $search_description, locale_code: $locale_code
      }
    }, 
    author_articles: {data: {author_id: $author_id}}, tag_articles: {data: {tag_id: $tag_id}}}) {
    id
    slug
    article_google_documents {
      article_id
      google_document_id
    }
    author_articles {
      article_id
      author_id
    }
    tag_articles {
      tag_id
      article_id
    }
  }
}`;

function hasuraGetSiteData(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SITE_DATA,
    name: 'FrontendGetSiteData',
  });
}

async function hasuraInsertTestArticle(params) {
  console.log('hasuraInsertTestArticle params:', params);

  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_TEST_ARTICLE,
    name: 'FrontendInsertArticle',
    variables: {
      google_document_id: params['google_document_id'],
      locale_code: params['locale_code'],
      category_id: params['category_id'],
      slug: params['slug'],
      content: params['content'],
      headline: params['headline'],
      search_title: params['search_title'],
      search_description: params['search_description'],
      facebook_title: params['facebook_title'],
      facebook_description: params['facebook_description'],
      twitter_title: params['twitter_title'],
      twitter_description: params['twitter_description'],
      author_id: params['author_id'],
      tag_id: params['tag_id'],
    },
  });
}

const HASURA_INSERT_TEST_PAGE = `mutation FrontendInsertPage($google_document_id: Int, $slug: String, $content: jsonb, $headline: String, $search_title: String, $search_description: String, $locale_code: String, $facebook_title: String = "", $facebook_description: String = "", $twitter_title: String = "", $twitter_description: String = "") {
  insert_pages_one(object: {page_google_documents: {data: {google_document_id: $google_document_id}, on_conflict: {constraint: page_google_documents_page_id_google_document_id_key, update_columns: google_document_id}}, slug: $slug, page_translations: {data: {content: $content, facebook_description: $facebook_description, facebook_title: $facebook_title, headline: $headline, locale_code: $locale_code, search_description: $search_description, published: true, search_title: $search_title, twitter_description: $twitter_description, twitter_title: $twitter_title}}, page_slug_versions: {data: {slug: $slug}}}) {
    id
    slug
  }
}`;

async function hasuraInsertTestPage(params) {
  console.log('hasuraInsertTestPage params:', params);

  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_TEST_PAGE,
    name: 'FrontendInsertPage',
    variables: {
      google_document_id: params['google_document_id'],
      locale_code: params['locale_code'],
      slug: params['slug'],
      content: params['content'],
      headline: params['headline'],
      search_title: params['search_title'],
      search_description: params['search_description'],
      facebook_title: params['facebook_title'],
      facebook_description: params['facebook_description'],
      twitter_title: params['twitter_title'],
      twitter_description: params['twitter_description'],
    },
  });
}

async function seedData(params) {
  const deleteOrgResult = await hasuraRemoveOrganization({
    url: params['url'],
    adminSecret: params['adminSecret'],
    slug: params['org']['slug'],
  });
  if (deleteOrgResult.errors) {
    console.error(
      params['adminSecret'],
      'Error deleting organization: ',
      deleteOrgResult.errors
    );
    // return orgResult.errors;
  } else {
    console.log('deleted organization:', deleteOrgResult);
  }
  const orgResult = await hasuraInsertOrganization({
    url: params['url'],
    adminSecret: params['adminSecret'],
    name: params['org']['name'],
    slug: params['org']['slug'],
  });
  if (orgResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating organization: ',
      orgResult.errors
    );
    return orgResult;
  }
  console.log('created organization:', orgResult);

  let organizationID = orgResult.data.insert_organizations_one.id;
  let name = params['org']['name'];

  const localeResult = await hasuraInsertLocale({
    url: params['url'],
    adminSecret: params['adminSecret'],
    name: 'English',
    code: 'en-US',
  });
  if (localeResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating locale: ',
      localeResult.errors
    );
    return localeResult;
  }
  console.log('created en-US locale', localeResult);
  let localeID = localeResult.data.insert_locales_one.id;

  let orgLocaleObjects = [
    {
      locale_id: localeID,
      organization_id: organizationID,
    },
  ];

  let orgLocaleResult = await hasuraInsertOrgLocales({
    url: params['url'],
    adminSecret: params['adminSecret'],
    orgLocales: orgLocaleObjects,
  });
  if (orgLocaleResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating org locale: ',
      orgLocaleResult.errors
    );
    return orgLocaleResult;
  }
  console.log('Setup locales for the organization:', orgLocaleResult);

  let siteMetadata = {
    color: 'colorone',
    theme: 'styleone',
    siteUrl: 'http://localhost:3000',
    aboutCTA: 'Learn more',
    aboutDek: `About the ${name} TK`,
    aboutHed: 'Who We Are',
    bodyFont: 'Domine',
    shortName: name,
    supportCTA: 'Donate',
    supportDek: `${name} exists based on the support of our readers. Chip in today to help us continue delivering quality journalism.`,
    supportHed: 'Support our work',
    supportURL:
      'https://tiny-news-collective.monkeypod.io/give/support-the-oaklyn-observer?secret=84fc2987ea6e8f11b8f4f8aca8b749d7',
    footerTitle: 'Footer Title',
    headingFont: 'Libre Franklin',
    searchTitle: name,
    primaryColor: '#de7a00',
    twitterTitle: 'Twitter title',
    facebookTitle: 'Facebook title',
    homepageTitle: name,
    membershipDek:
      'Support great journalism by becoming a member for a low monthly price.',
    membershipHed: 'Become a member',
    newsletterDek: `Get the latest headlines from ${name} right in your inbox.`,
    newsletterHed: 'Sign up for our newsletter',
    donateBlockDek: 'Support our local journalism with a monthly pledge.',
    donateBlockHed: 'Donate',
    secondaryColor: '#002c57',
    donationOptions:
      '[{\n"amount": 5,\n"name": "Member",\n"description": "This is a description.",\n"cta": "Donate"\n},\n{\n"amount": 10,\n"name": "Supporter",\n"description": "This is a description.",\n"cta": "Donate"\n},\n{\n"amount": 20,\n"name": "Superuser",\n"description": "This is a description.",\n"cta": "Donate"\n}]',
    footerBylineLink: 'http://localhost:3000',
    footerBylineName: name,
    searchDescription: 'Page description',
    twitterDescription: 'Twitter description',
    facebookDescription: 'Facebook description',
    commenting: 'on',
    advertisingHed: `Advertise with ${name}`,
    advertisingDek:
      'Want to reach our engaged, connected audience? Advertise within our weekly newsletter!',
    advertisingCTA: 'Buy an advertisement',
  };
  let metadataResult = await hasuraUpsertMetadata({
    url: params['url'],
    adminSecret: params['adminSecret'],
    organization_id: organizationID,
    data: siteMetadata,
    locale_code: 'en-US',
    published: true,
  });
  if (metadataResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating metadata: ',
      metadataResult.errors
    );
    return metadataResult;
  }
  console.log('Setup metadata for the organization:', metadataResult);

  let sectionResult = await hasuraInsertSections({
    url: params['url'],
    adminSecret: params['adminSecret'],
    objects: [
      {
        organization_id: organizationID,
        title: 'News',
        slug: 'news',
        published: true,
        category_translations: {
          data: {
            locale_code: 'en-US',
            title: 'News',
          },
          on_conflict: {
            constraint: 'category_translations_locale_code_category_id_key',
            update_columns: 'title',
          },
        },
      },
    ],
  });
  if (sectionResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating section: ',
      sectionResult.errors
    );
    return sectionResult;
  }
  console.log('Setup section for the organization:', sectionResult);
  let categoryID = sectionResult.data.insert_categories.returning[0].id;
  let largeLayoutResult = await hasuraUpsertHomepageLayout({
    url: params['url'],
    adminSecret: params['adminSecret'],
    organization_id: organizationID,
    name: 'Large Package Story Lead',
    data:
      '{ "subfeatured-top":"string", "subfeatured-bottom":"string", "featured":"string" }',
  });
  if (largeLayoutResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating large package layout: ',
      largeLayoutResult.errors
    );
    return largeLayoutResult;
  }
  console.log(
    'Setup large package layout for the organization:',
    largeLayoutResult
  );

  let bigLayoutResult = await hasuraUpsertHomepageLayout({
    url: params['url'],
    adminSecret: params['adminSecret'],
    organization_id: organizationID,
    name: 'Big Featured Story',
    data: '{ "featured":"string" }',
  });
  if (bigLayoutResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating big featured layout: ',
      bigLayoutResult.errors
    );
    return bigLayoutResult;
  }
  console.log(
    'Setup big featured layout for the organization:',
    bigLayoutResult
  );
  let authorResult = await hasuraInsertOneAuthor({
    url: params['url'],
    orgSlug: params['orgSlug'],
    first_names: faker.name.firstName(),
    last_name: faker.name.lastName(),
    title: faker.name.jobTitle(),
    twitter: faker.internet.userName(),
    bio: faker.name.jobDescriptor(),
    slug: faker.lorem.slug(),
    email: faker.internet.email(),
  });
  if (authorResult.errors) {
    console.error(
      params['orgSlug'],
      'Error creating author: ',
      authorResult.errors
    );
    return authorResult;
  }
  console.log('Setup author for the organization:', authorResult);
  let authorID = authorResult.data.insert_authors_one.id;

  let tagResult = await hasuraCreateOneTag({
    url: params['url'],
    orgSlug: params['orgSlug'],
    slug: 'latest-news',
    title: 'Latest News',
    locale_code: 'en-US',
  });
  if (tagResult.errors) {
    console.error(params['orgSlug'], 'Error creating tag:', tagResult.errors);
    return tagResult;
  }
  console.log('Setup tag for the organization:', tagResult);
  let tagID = tagResult.data.insert_tags_one.id;

  let gdocResult = await hasuraInsertGoogleDoc({
    url: params['url'],
    orgSlug: params['orgSlug'],
    document_id: '1LSyMzR1KxyKoml6q56DYQaxEV8Qm4EZo2y_xEFIkvGw',
    locale_code: 'en-US',
  });
  if (gdocResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating test google doc: ',
      gdocResult.errors
    );
    return gdocResult;
  }
  console.log(
    'Setup test article google doc for the organization:',
    gdocResult
  );
  let articleGoogleDocID = gdocResult.data.insert_google_documents_one.id;

  let pageGdocResult = await hasuraInsertGoogleDoc({
    document_id: '1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU',
    url: params['url'],
    orgSlug: params['orgSlug'],
    locale_code: 'en-US',
  });
  if (pageGdocResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating test google doc: ',
      pageGdocResult.errors
    );
    return pageGdocResult;
  }
  console.log(
    'Setup test static page google doc for the organization:',
    pageGdocResult
  );
  let pageGoogleDocID = pageGdocResult.data.insert_google_documents_one.id;

  let articleResult = await hasuraInsertTestArticle({
    url: params['url'],
    orgSlug: params['orgSlug'],
    google_document_id: articleGoogleDocID,
    locale_code: 'en-US',
    category_id: categoryID,
    slug: 'test-doc-for-article-features',
    content: faker.lorem.paragraph(),
    headline: faker.lorem.sentence(),
    search_title: faker.lorem.sentence(),
    search_description: faker.lorem.paragraph(),
    author_id: authorID,
    tag_id: tagID,
  });
  if (articleResult.errors) {
    console.error(
      params['orgSlug'],
      'Error creating test article: ',
      articleResult.errors
    );
    return articleResult;
  }
  console.log('Setup test article for the organization:', articleResult);

  let pageResult = await hasuraInsertTestPage({
    url: params['url'],
    orgSlug: params['orgSlug'],
    google_document_id: pageGoogleDocID,
    locale_code: 'en-US',
    slug: 'test-about-page',
    content: faker.lorem.paragraph(),
    headline: faker.lorem.sentence(),
    search_title: faker.lorem.sentence(),
    search_description: faker.lorem.paragraph(),
  });
  if (pageResult.errors) {
    console.error(
      params['orgSlug'],
      'Error creating test page: ',
      pageResult.errors
    );
    return pageResult;
  }
  console.log('Setup test page for the organization:', pageResult);
  return orgResult;
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
      'TNC-Organization': orgSlug,
    };
  } else if (params.hasOwnProperty('adminSecret')) {
    requestHeaders = {
      'x-hasura-admin-secret': params['adminSecret'],
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
  hasuraGetSiteData,
  hasuraInsertLocale,
  hasuraInsertOneAuthor,
  hasuraInsertNewsletterEdition,
  hasuraInsertOrganization,
  hasuraInsertOrgLocales,
  hasuraInsertPageView,
  hasuraInsertArticleSession,
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
  hasuraGetArticlesRss,
  hasuraAdminInsertLocales,
  hasuraInsertGoogleDoc,
  hasuraInsertTestArticle,
  hasuraCreateOneTag,
  fetchGraphQL,
  sanitizePath,
  seedData,
};
