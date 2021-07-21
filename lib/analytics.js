import { fetchGraphQL } from './utils';

const HASURA_GET_DATA_IMPORTS = `query FrontendGetDataImports {
  ga_data_imports(order_by: {created_at: desc}) {
    created_at
    end_date
    id
    notes
    start_date
    organization_id
    table_name
    updated_at
  }
}`;

export function hasuraGetDataImports(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_DATA_IMPORTS,
    name: 'FrontendGetDataImports',
  });
}

const HASURA_GET_REFERRAL_SESSIONS = `query FrontendGetReferralSessions($startDate: date!, $endDate: date!) {
  ga_referral_sessions(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    count
    date
    source
  }
}`;

export async function hasuraGetReferralSessions(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_REFERRAL_SESSIONS,
    name: 'FrontendGetReferralSessions',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_GEO_SESSIONS = `query FrontendGetGeoSessions($startDate: date!, $endDate: date!) {
  ga_geo_sessions(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    count
    date
    region
  }
}`;

export async function hasuraGetGeoSessions(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_GEO_SESSIONS,
    name: 'FrontendGetGeoSessions',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_SESSIONS = `query FrontendGetSessions($startDate: date!, $endDate: date!) {
  ga_sessions(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    count
    date
  }
}`;

export async function hasuraGetSessions(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SESSIONS,
    name: 'FrontendGetSessions',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_YESTERDAYS_DATA = `query FrontendGetYesterday($startDate: date!, $endDate: date!, $donorDim: String!, $subscriberDim: String!) {
  donorDimensions: ga_custom_dimensions(where: {date: {_gte: $startDate, _lte: $endDate}, dimension: {_eq: $donorDim}}) {
    count
    date
    label
  }
  subscriberDimensions: ga_custom_dimensions(where: {date: {_gte: $startDate, _lte: $endDate}, dimension: {_eq: $subscriberDim}}) {
    count
    date
    label
  }
  ga_page_views(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}, path: {_nilike: "/tinycms%"}}) {
    count
    date
    path
  }
  ga_reading_depth(where: {date: {_gte: $startDate, _lte: $endDate}}) {
    date
    path
    read_100
    read_25
    read_50
    read_75
  }
  ga_sessions(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    count
    date
  }
}`;

export async function hasuraGetYesterday(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_YESTERDAYS_DATA,
    name: 'FrontendGetYesterday',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
      donorDim: 'dimension4',
      subscriberDim: 'dimension5',
    },
  });
}

const HASURA_GET_SESSION_DURATION = `query FrontendGetSessionDuration($startDate: date!, $endDate: date!) {
  ga_session_duration(order_by: {date: asc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    seconds
    date
  }
}`;

export async function hasuraGetSessionDuration(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SESSION_DURATION,
    name: 'FrontendGetSessionDuration',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_READING_DEPTH_PAGE_VIEWS = `query FrontendGetReadingDepthPageViews($date: date_comparison_exp) {
  ga_reading_depth(where: {date: $date}) {
    date
    id
    organization_id
    path
    read_100
    read_25
    read_50
    read_75
  }
  ga_page_views(where: {date: $date}) {
    count
    date
    id
    organization_id
    path
  }
}`;

export async function hasuraGetReadingDepth(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_READING_DEPTH_PAGE_VIEWS,
    name: 'FrontendGetReadingDepthPageViews',
    variables: { date: { _gte: params['startDate'], _lte: params['endDate'] } },
  });
}

const HASURA_GET_CUSTOM_DIMENSION = `query FrontendGetCustomDimension($startDate: date!, $endDate: date!, $dimension: String) {
  ga_custom_dimensions(where: {date: {_gte: $startDate, _lte: $endDate}, dimension: {_eq: $dimension}}) {
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

export async function hasuraGetCustomDimension(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_CUSTOM_DIMENSION,
    name: 'FrontendGetCustomDimension',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
      dimension: params['dimension'],
    },
  });
}

const HASURA_GET_READING_FREQUENCY = `query FrontendGetReadingFrequency($startDate: date!, $endDate: date!) {
  ga_reading_frequency(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    id
    date
    count
    category
  }
}`;

export async function hasuraGetReadingFrequency(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_READING_FREQUENCY,
    name: 'FrontendGetReadingFrequency',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_DONATION_CLICKS = `query FrontendGetDonationClicks($startDate: date!, $endDate: date!) {
  ga_donation_clicks(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}, path: {_nilike: "/tinycms%"}}) {
    count
    action
    date
    path
  }
  ga_donor_reading_frequency(where: {date: {_gte: $startDate, _lte: $endDate}}) {
    count
    created_at
    date
    id
    label
    updated_at
  }
  ga_page_views(where: {date: {_gte: $startDate, _lte: $endDate}}) {
    count
    date
    id
    path
  }
}`;

export async function hasuraGetDonationClicks(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_DONATION_CLICKS,
    name: 'FrontendGetDonationClicks',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_NEWSLETTER_IMPRESSIONS = `query FrontendGetNewsletterImpressions($startDate: date!, $endDate: date!) {
  ga_newsletter_impressions(order_by: {date: asc, impressions: desc}, where: {date: {_gte: $startDate, _lte: $endDate}, path: {_nilike: "/tinycms%"}}) {
    impressions
    action
    date
    path
  }
}`;

export async function hasuraGetNewsletterImpressions(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_NEWSLETTER_IMPRESSIONS,
    name: 'FrontendGetNewsletterImpressions',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_PAGE_VIEWS = `query FrontendGetPageViews($startDate: date!, $endDate: date!, $limit: Int) {
  ga_page_views(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}, path: {_nilike: "/tinycms%"}}, limit: $limit) {
    count
    date
    path
  }
}`;

export async function hasuraGetPageViews(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_PAGE_VIEWS,
    name: 'FrontendGetPageViews',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
      limit: params['limit'],
    },
  });
}

export function getMetricsData(
  viewID,
  startDate,
  endDate,
  metrics,
  dimensions,
  orderBy
) {
  const requestDimensions = (dimensions) => {
    let result = [];
    dimensions.forEach((item) => {
      result.push({
        name: item,
      });
    });
    return result;
  };

  const requestMetrics = (metrics) => {
    let result = [];
    metrics.forEach((item) => {
      result.push({
        expression: item,
      });
    });
    return result;
  };

  return window.gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      reportRequests: [
        {
          viewId: viewID,
          dateRanges: [
            {
              startDate: startDate,
              endDate: endDate,
            },
          ],
          filtersExpression:
            orderBy && orderBy.filters ? orderBy.filters : null,
          metrics: requestMetrics(metrics),
          dimensions: requestDimensions(dimensions),
          orderBys:
            orderBy && orderBy.fieldName && orderBy.order
              ? [
                  {
                    fieldName: orderBy.fieldName,
                    sortOrder: orderBy.order,
                  },
                ]
              : [],
        },
      ],
    },
  });
}

const INSERT_DATA_IMPORT = `mutation FrontendInsertDataImport($success: Boolean, $notes: String, $end_date: date, $start_date: date, $table_name: String, $row_count: Int) {
  insert_ga_data_imports_one(object: {success: $success, end_date: $end_date, notes: $notes, start_date: $start_date, table_name: $table_name, row_count: $row_count}, on_conflict: {constraint: ga_data_imports_organization_id_table_name_start_date_end_d_key, update_columns: success}) {
    id
    success
    notes
    end_date
    organization_id
    start_date
    table_name
    row_count
    created_at
    updated_at
  }
}`;

export async function hasuraInsertDataImport(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: INSERT_DATA_IMPORT,
    name: 'FrontendInsertDataImport',
    variables: {
      notes: params['notes'],
      success: params['success'],
      end_date: params['end_date'],
      start_date: params['start_date'],
      table_name: params['table_name'],
      row_count: params['row_count'],
    },
  });
}

const GET_READING_DEPTH_FOR_PATH = `query FrontendGetReadingDepthForPath($path: String, $startDate: date, $endDate: date) {
  ga_reading_depth(where: {path: {_eq: $path}, date: {_gte: $startDate, _lte: $endDate}}) {
    date
    path
    read_100
    read_25
    read_50
    read_75
  }
}`;

export async function hasuraGetReadingDepthForPath(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: GET_READING_DEPTH_FOR_PATH,
    name: 'FrontendGetReadingDepthForPath',
    variables: {
      start_date: params['start_date'],
      end_date: params['end_date'],
      path: params['path'],
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

export async function hasuraInsertSessionDuration(params) {
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

const HASURA_INSERT_DONOR_READING_FREQUENCY = `mutation FrontendInsertDonorReadingFrequency($count: Int!, $label: String!, $date: date!) {
  insert_ga_donor_reading_frequency_one(object: {count: $count, label: $label, date: $date}, on_conflict: {constraint: ga_donor_reading_frequency_organization_id_label_date_key, update_columns: count}) {
    updated_at
    id
    created_at
    count
    date
    label
  }
}`;

export async function hasuraInsertDonorReadingFrequency(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_DONOR_READING_FREQUENCY,
    name: 'FrontendInsertDonorReadingFrequency',
    variables: {
      count: params['count'],
      label: params['label'],
      date: params['date'],
    },
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

export async function hasuraInsertPageView(params) {
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

export async function hasuraInsertReferralSession(params) {
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

const HASURA_INSERT_GEO_SESSION_DATA = `mutation FrontendInsertGeoSession($count: Int!, $date: date!, $region: String!) {
  insert_ga_geo_sessions_one(object: {region: $region, count: $count, date: $date}) {
    updated_at
    id
    created_at
    region
    count
    date
    organization_id
  }
}`;

export async function hasuraInsertGeoSession(params) {
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

export async function hasuraInsertSession(params) {
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

export async function hasuraInsertNewsletterImpression(params) {
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

export async function hasuraInsertDonationClick(params) {
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

export async function hasuraInsertCustomDimension(params) {
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
}
`;

export async function hasuraInsertReadingFrequency(params) {
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

const HASURA_INSERT_READING_DEPTH_DATA = `mutation FrontendInsertReadingDepth($date: date!, $path: String!, $read_100: float8!, $read_25: float8!, $read_50: float8!, $read_75: float8!) {
  insert_ga_reading_depth_one(object: {path: $path, date: $date, read_25: $read_25, read_50: $read_50, read_75: $read_75, read_100: $read_100}) {
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

export async function hasuraInsertReadingDepth(params) {
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

const HASURA_GET_SOURCE_ETHNICITY_DISTRIBUTION = `query SourceEthnicityDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      ethnicity
    }
  }
}`;

export async function hasuraGetSourceDistroByEthnicity(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SOURCE_ETHNICITY_DISTRIBUTION,
    name: 'SourceEthnicityDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_RACE_DISTRIBUTION = `query SourceRaceDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      race
    }
  }
}`;

export async function hasuraGetSourceDistroByRace(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SOURCE_RACE_DISTRIBUTION,
    name: 'SourceRaceDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_AGE_DISTRIBUTION = `query SourceAgeDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      age
    }
  }
}`;

export async function hasuraGetSourceDistroByAge(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SOURCE_AGE_DISTRIBUTION,
    name: 'SourceAgeDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_GENDER_DISTRIBUTION = `query SourceGenderDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      gender
    }
  }
}`;

export async function hasuraGetSourceDistroByGender(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SOURCE_GENDER_DISTRIBUTION,
    name: 'SourceGenderDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_SEXUAL_ORIENTATION_DISTRIBUTION = `query SourceSexualOrientationDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      sexual_orientation
    }
  }
}`;

export async function hasuraGetSourceDistroBySexualOrientation(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SOURCE_SEXUAL_ORIENTATION_DISTRIBUTION,
    name: 'SourceSexualOrientationDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_ZIPS = `query SourceZipCodes($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}, zip: {_neq: ""}}) {
    aggregate {
      count
    }
    nodes {
      zip
    }
  }
}`;

export async function hasuraGetSourceZipCodes(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SOURCE_ZIPS,
    name: 'SourceZipCodes',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

export function sanitizePath(path) {
  if (/\?/.test(path)) {
    path = path.split('?')[0];
  }
  if (/\/en-US\//.test(path)) {
    path = path.replace('/en-US', '');
  }
  return path;
}
