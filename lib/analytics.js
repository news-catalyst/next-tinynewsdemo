import { format } from 'date-fns';
import { fetchGraphQL } from './utils';

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
              startDate: format(new Date(startDate), 'yyyy-MM-dd'),
              endDate: format(new Date(endDate), 'yyyy-MM-dd'),
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
