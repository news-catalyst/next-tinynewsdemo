import { format } from 'date-fns';

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
