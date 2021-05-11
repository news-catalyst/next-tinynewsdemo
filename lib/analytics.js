import { format } from 'date-fns';
import { fetchGraphQL } from './utils';

const HASURA_GET_DATA_IMPORTS = `query MyQuery {
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
    name: 'MyQuery',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_REFERRAL_SESSIONS = `query MyQuery($startDate: date!, $endDate: date!) {
  ga_referral_sessions(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    count
    date
    source
  }
}`;

export function hasuraGetReferralSessions(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_REFERRAL_SESSIONS,
    name: 'MyQuery',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_GEO_SESSIONS = `query MyQuery($startDate: date!, $endDate: date!) {
  ga_geo_sessions(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    count
    date
    region
  }
}`;

export function hasuraGetGeoSessions(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_GEO_SESSIONS,
    name: 'MyQuery',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_SESSIONS = `query MyQuery($startDate: date!, $endDate: date!) {
  ga_sessions(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    count
    date
  }
}`;

export function hasuraGetSessions(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SESSIONS,
    name: 'MyQuery',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_SESSION_DURATION = `query MyQuery($startDate: date!, $endDate: date!) {
  ga_session_duration(order_by: {date: asc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    seconds
    date
  }
}`;

export function hasuraGetSessionDuration(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SESSION_DURATION,
    name: 'MyQuery',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_READING_DEPTH_PAGE_VIEWS = `query MyQuery($date: date_comparison_exp) {
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

export function hasuraGetReadingDepth(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_READING_DEPTH_PAGE_VIEWS,
    name: 'MyQuery',
    variables: { date: { _gte: params['startDate'], _lte: params['endDate'] } },
  });
}

const HASURA_GET_CUSTOM_DIMENSION = `query MyQuery($startDate: date!, $endDate: date!, $dimension: String) {
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

export function hasuraGetCustomDimension(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_CUSTOM_DIMENSION,
    name: 'MyQuery',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
      dimension: params['dimension'],
    },
  });
}

const HASURA_GET_READING_FREQUENCY = `query MyQuery($startDate: date!, $endDate: date!) {
  ga_reading_frequency(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}}) {
    id
    date
    count
    category
  }
}`;

export function hasuraGetReadingFrequency(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_READING_FREQUENCY,
    name: 'MyQuery',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_NEWSLETTER_IMPRESSIONS = `query MyQuery($startDate: date!, $endDate: date!) {
  ga_newsletter_impressions(order_by: {date: asc, impressions: desc}, where: {date: {_gte: $startDate, _lte: $endDate}, path: {_nilike: "/tinycms%"}}) {
    impressions
    action
    date
    path
  }
}`;

export function hasuraGetNewsletterImpressions(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_NEWSLETTER_IMPRESSIONS,
    name: 'MyQuery',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
  });
}

const HASURA_GET_PAGE_VIEWS = `query MyQuery($startDate: date!, $endDate: date!) {
  ga_page_views(order_by: {date: asc, count: desc}, where: {date: {_gte: $startDate, _lte: $endDate}, path: {_nilike: "/tinycms%"}}) {
    count
    date
    path
  }
}`;

export function hasuraGetPageViews(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_PAGE_VIEWS,
    name: 'MyQuery',
    variables: { startDate: params['startDate'], endDate: params['endDate'] },
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

const INSERT_DATA_IMPORT = `mutation MyMutation($notes: String, $end_date: date, $start_date: date, $table_name: String) {
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

export async function hasuraInsertDataImport(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: INSERT_DATA_IMPORT,
    name: 'MyMutation',
    variables: {
      notes: params['notes'],
      end_date: params['end_date'],
      start_date: params['start_date'],
      table_name: params['table_name'],
    },
  });
}

const HASURA_INSERT_SESSION_DURATION_DATA = `mutation MyMutation($seconds: float8!, $date: date!) {
  insert_ga_session_duration_one(object: {seconds: $seconds, date: $date}) {
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
    name: 'MyMutation',
    variables: {
      seconds: params['seconds'],
      date: params['date'],
    },
  });
}

export async function getSessionDuration(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let apiUrl = params['apiUrl'];
  let orgSlug = params['orgSlug'];
  let viewID = params['viewID'];

  console.log('getting session duration', startDate, endDate);

  const dimensions = ['ga:date'];
  const timeMetric = 'ga:avgSessionDuration';

  getMetricsData(viewID, startDate, endDate, [timeMetric], dimensions)
    .then((response) => {
      const queryResult = response.result.reports[0].data.rows;

      queryResult.forEach((row) => {
        let date = row.dimensions[0];
        let value = parseInt(row.metrics[0].values[0]);

        hasuraInsertSessionDuration({
          url: apiUrl,
          orgSlug: orgSlug,
          seconds: value,
          date: date,
        })
          .then((res) => {
            if (res.errors) {
              console.error(
                '[GA] error inserting session duration data: ',
                res.errors
              );
            } else {
              console.log(' + session duration', date, value);
            }
          })
          .catch((e) => {
            console.error(
              '[GA] Error inserting session duration data into hasura:',
              e
            );
            return false;
          });
      });
      hasuraInsertDataImport({
        url: apiUrl,
        orgSlug: orgSlug,
        table_name: 'ga_session_duration',
        start_date: startDate,
        end_date: endDate,
      })
        .then((res) => {
          console.log('[GA] updated data audits table:', res);
          return true;
        })
        .catch((e) => {
          console.error('[GA] Error updating data audits table:', e, res);
          return false;
        });
    })
    .catch((e) => {
      console.error('[GA] Error getting session duration data:', e);
      return false;
    });
}
