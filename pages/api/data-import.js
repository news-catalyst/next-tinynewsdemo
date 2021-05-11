import {
  hasuraGetDataImports,
  hasuraInsertDataImport,
  hasuraInsertPageView,
  hasuraInsertGeoSession,
  hasuraInsertCustomDimension,
  hasuraInsertNewsletterImpression,
  hasuraInsertReadingDepth,
  hasuraInsertReadingFrequency,
  hasuraInsertReferralSession,
  hasuraInsertSession,
  hasuraInsertSessionDuration,
} from '../../lib/analytics';

const { google } = require('googleapis');
const googleAnalyticsViewID = process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID;

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

const credsEmail = process.env.GOOGLE_CREDENTIALS_EMAIL;
const credsPrivateKey = process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY;
const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/analytics',
  'https://www.googleapis.com/auth/analytics.edit',
];
const auth = new google.auth.JWT(credsEmail, null, credsPrivateKey, scopes);
const analyticsreporting = google.analyticsreporting({ version: 'v4', auth });

async function getSessionDuration(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];

  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:avgSessionDuration',
              },
            ],
            dimensions: [
              {
                name: 'ga:date',
              },
            ],
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;
      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let date = row.dimensions[0];
          let value = row.metrics[0].values[0];

          hasuraInsertSessionDuration({
            url: apiUrl,
            orgSlug: apiToken,
            seconds: value,
            date: date,
          })
            .then((res) => {
              if (res.errors) {
                errors.push(
                  '[GA] error inserting session duration data: ',
                  res.errors
                );
              } else {
                results.push(' + session duration', date, value);
              }
            })
            .catch((e) => {
              errors.push(
                '[GA] Error inserting session duration data into hasura:',
                e
              );
            });
        });
        hasuraInsertDataImport({
          url: apiUrl,
          orgSlug: apiToken,
          table_name: 'ga_session_duration',
          start_date: startDate,
          end_date: endDate,
        })
          .then((res) => {
            results.push('[GA] updated data audits table:', res);
          })
          .catch((e) =>
            errors.push('[GA] Error updating data audits table:', e, res)
          );
      } else {
        errors.push(
          '[GA] no session duration data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) => errors.push('[GA] Error getting session duration data:', e));

  return { errors, results };
}

async function getReferralSessions(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];
  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:sessions',
              },
            ],
            dimensions: [
              {
                name: 'ga:source',
              },
            ],
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let source = row.dimensions[0];
          let value = row.metrics[0].values[0];

          hasuraInsertReferralSession({
            url: apiUrl,
            orgSlug: apiToken,
            count: value,
            source: source,
            date: startDate,
          })
            .then((res) => {
              if (res.errors) {
                errors.push(
                  '[GA] error inserting referral session data: ',
                  res.errors
                );
              } else {
                results.push(' + referral session ', source, value, startDate);
              }
            })
            .catch((e) =>
              errors.push(
                '[GA] Error inserting referral session data into hasura:',
                e
              )
            );
        });
      } else {
        errors.push(
          '[GA] no referral session data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) => errors.push('[GA] Error getting referral sessions:', e));

  return { errors, results };
}

async function getGeoSessions(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];

  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:sessions',
              },
            ],
            dimensions: [
              {
                name: 'ga:country',
              },
              {
                name: 'ga:region',
              },
            ],
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let region = row.dimensions.join(' - ');
          let value = row.metrics[0].values[0];

          hasuraInsertGeoSession({
            url: apiUrl,
            orgSlug: apiToken,
            count: value,
            region: region,
            date: startDate,
          })
            .then((res) => {
              if (res.errors) {
                errors.push(
                  '[GA] error inserting geo session data: ',
                  res.errors
                );
              } else {
                results.push(' + geo session ', region, value, endDate);
              }
            })
            .catch((e) =>
              errors.push(
                '[GA] Error inserting geo session data into hasura:',
                e
              )
            );
        });
      } else {
        errors.push(
          '[GA] no geo session data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) => errors.push('[GA] Error getting geo sessions:', e));
  return { errors, results };
}

async function getSessions(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];

  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:sessions',
              },
            ],
            dimensions: [
              {
                name: 'ga:date',
              },
            ],
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let sessionDate = row.dimensions[0];
          let value = row.metrics[0].values[0];

          hasuraInsertSession({
            url: apiUrl,
            orgSlug: apiToken,
            count: value,
            date: sessionDate,
          })
            .then((res) => {
              if (res.errors) {
                errors.push(
                  '[GA] error inserting session data: ',
                  sessionDate,
                  value,
                  JSON.stringify(row),
                  res.errors
                );
              } else {
                results.push(' + session ', sessionDate, value);
              }
            })
            .catch((e) =>
              errors.push('[GA] Error inserting session data into hasura:', e)
            );
        });
      } else {
        errors.push(
          '[GA] no session data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) => errors.push('[GA] Error getting sessions:', e));
  return { errors, results };
}

async function getReadingFrequency(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];

  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:pageviews',
              },
            ],
            dimensions: [
              {
                name: 'ga:dimension2',
              },
            ],
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let category = row.dimensions.join(' - ');
          let count = row.metrics[0].values[0];

          hasuraInsertReadingFrequency({
            url: apiUrl,
            orgSlug: apiToken,
            count: count,
            date: startDate,
            category: category,
          })
            .then((res) => {
              if (res.errors) {
                errors.push(
                  '[GA] error inserting reading frequency data: ',
                  res.errors
                );
              } else {
                results.push(' + reading frequency ', category, count);
              }
            })
            .catch((e) =>
              errors.push(
                '[GA] Error inserting reading frequency data into hasura:',
                e
              )
            );
        });
      } else {
        errors.push(
          '[GA] no reading frequency data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) => errors.push('[GA] Error getting reading frequency:', e));
  return { errors, results };
}

async function getPageViews(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];

  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:pageviews',
              },
            ],
            dimensions: [
              {
                name: 'ga:pagePath',
              },
            ],
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let path = row.dimensions[0];
          let value = row.metrics[0].values[0];

          hasuraInsertPageView({
            url: apiUrl,
            orgSlug: apiToken,
            count: value,
            date: startDate,
            path: path,
          })
            .then((res) => {
              if (res.errors) {
                errors.push('[GA] error inserting pageview data: ', res.errors);
              } else {
                results.push(' + pageview ', path, value);
              }
            })
            .catch((e) =>
              errors.push('[GA] Error inserting page view data into hasura:', e)
            );
        });
      } else {
        errors.push(
          '[GA] no page view data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) => errors.push('[GA] Error getting page views:', e));

  return { errors, results };
}

async function getSubscriberDimension(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];

  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:sessions',
              },
            ],
            dimensions: [{ name: 'ga:dimension5' }],
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let isSubscriber = parseInt(row.dimensions[0]);
          if (isSubscriber) {
            let count = row.metrics[0].values[0];
            hasuraInsertCustomDimension({
              url: apiUrl,
              orgSlug: apiToken,
              date: startDate,
              label: 'isSubscriber',
              dimension: 'dimension5',
              count: count,
            })
              .then((res) => {
                if (res.errors) {
                  errors.push(
                    '[GA] error inserting subscriber data: ',
                    res.errors
                  );
                } else {
                  results.push(' + subscriber', startDate, count);
                }
              })
              .catch((e) =>
                errors.push(
                  '[GA] Error inserting subscriber data into hasura:',
                  e
                )
              );
          }
        });
      } else {
        errors.push(
          '[GA] no subscriber data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) => errors.push('[GA] Error getting subscriber data:', e));

  return { errors, results };
}

async function getDonorDimension(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];

  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:sessions',
              },
            ],
            dimensions: [{ name: 'ga:dimension4' }],
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      console.log('donor data from', startDate, 'to', endDate);
      // console.log(JSON.stringify(reports))
      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let isDonor = parseInt(row.dimensions[0]);
          if (isDonor) {
            let count = row.metrics[0].values[0];
            hasuraInsertCustomDimension({
              url: apiUrl,
              orgSlug: apiToken,
              date: startDate,
              label: 'isDonor',
              dimension: 'dimension4',
              count: count,
            })
              .then((res) => {
                if (res.errors) {
                  errors.push('[GA] error inserting donor data: ', res.errors);
                } else {
                  results.push(' + donor', startDate, count);
                }
              })
              .catch((e) =>
                errors.push('[GA] Error inserting donor data into hasura:', e)
              );
          }
        });
      } else {
        errors.push(
          '[GA] no donor data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) => errors.push('[GA] Error getting donor data:', e));

  return { errors, results };
}

async function getNewsletterDimension(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];

  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:totalEvents',
              },
            ],
            dimensions: [
              { name: 'ga:eventCategory' },
              { name: 'ga:eventAction' },
              { name: 'ga:eventLabel' },
              { name: 'ga:dimension2' },
              { name: 'ga:date' },
            ],
            filtersExpression:
              'ga:eventCategory==NTG Newsletter;ga:eventAction==Newsletter Signup',
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      console.log('newsletter signup form data from', startDate, 'to', endDate);
      // console.log(JSON.stringify(reports))
      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let frequency = row.dimensions[3];
          let metricDate = row.dimensions[4];
          let signupCount = parseInt(row.metrics[0].values[0]);

          hasuraInsertCustomDimension({
            url: apiUrl,
            orgSlug: apiToken,
            date: metricDate,
            count: signupCount,
            label: frequency,
            dimension: 'dimension2',
          })
            .then((res) => {
              if (res.errors) {
                errors.push(res.errors);
              } else {
                results.push(
                  ' + newsletter signup form',
                  metricDate,
                  frequency,
                  signupCount
                );
              }
            })
            .catch((e) =>
              errors.push(
                '[GA] Error inserting newsletter signup form data into hasura:',
                e
              )
            );
        });
      } else {
        errors.push(
          '[GA] no newsletter signup form data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) =>
      errors.push('[GA] Error getting newsletter signup form data:', e)
    );

  return { results, errors };
}

async function getNewsletterImpressions(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];

  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:totalEvents',
              },
            ],
            dimensions: [
              { name: 'ga:eventAction' },
              { name: 'ga:eventCategory' },
              { name: 'ga:eventLabel' },
              { name: 'ga:pagePath' },
            ],
            filtersExpression: 'ga:eventCategory==NTG Newsletter',
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      let data = reports[0].data;

      if (data && data.rows) {
        data.rows.map((row) => {
          let articlePath = sanitizePath(row.dimensions[3]);

          if (articlePath !== '/') {
            let action = row.dimensions[0];
            let impressions = parseInt(row.metrics[0].values[0]);
            hasuraInsertNewsletterImpression({
              url: apiUrl,
              orgSlug: apiToken,
              date: startDate,
              path: articlePath,
              impressions: impressions,
              action: action,
            })
              .then((res) => {
                if (res.errors) {
                  errors.push(
                    '[GA] error inserting newsletter impression data: ',
                    res.errors
                  );
                } else {
                  results.push(
                    ' + reading depth',
                    startDate,
                    articlePath,
                    action,
                    impressions
                  );
                }
              })
              .catch((e) =>
                errors.push(
                  '[GA] Error inserting newsletter impression data into hasura:',
                  e
                )
              );
          }
        });
      } else {
        errors.push(
          '[GA] no newsletter impression data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) =>
      errors.push('[GA] Error getting newsletter impression data:', e)
    );

  return { errors, results };
}

async function getReadingDepth(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  let errors = [];
  let results = [];
  analyticsreporting.reports
    .batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:totalEvents',
              },
            ],
            dimensions: [
              { name: 'ga:eventAction' },
              { name: 'ga:eventCategory' },
              { name: 'ga:eventLabel' },
              { name: 'ga:pagePath' },
            ],
            filtersExpression: 'ga:eventCategory==NTG Article Milestone',
          },
        ],
      },
    })
    .then((response) => {
      let reports = response.data.reports;

      let data = reports[0].data;

      if (data && data.rows) {
        let collectedData = {};
        data.rows.map((row) => {
          let articlePath = sanitizePath(row.dimensions[3]);

          if (articlePath !== '/') {
            let percentage = row.dimensions[0];
            let label = `read_${percentage.replace('%', '')}`;
            let count = parseInt(row.metrics[0].values[0]);

            if (!collectedData[articlePath]) {
              collectedData[articlePath] = {};
            }
            if (!collectedData[articlePath][label]) {
              collectedData[articlePath][label] = count;
            } else {
              collectedData[articlePath][label] += count;
            }

            collectedData[articlePath]['date'] = startDate;
          }
        });
        // console.log("collectedData:", collectedData);
        Object.keys(collectedData).map((path) => {
          let cd = collectedData[path];
          let read25 = cd['read_25'] || 0;
          let read50 = cd['read_50'] || 0;
          let read75 = cd['read_75'] || 0;
          let read100 = cd['read_100'] || 0;
          hasuraInsertReadingDepth({
            url: apiUrl,
            orgSlug: apiToken,
            date: cd['date'],
            path: path,
            read_25: read25,
            read_50: read50,
            read_75: read75,
            read_100: read100,
          })
            .then((res) => {
              if (res.errors) {
                errors.push(
                  '[GA] error inserting reading depth data: ',
                  res.errors
                );
              } else {
                results.push(' + reading depth', cd['date'], path);
              }
            })
            .catch((e) =>
              errors.push(
                '[GA] Error inserting reading depth data into hasura:',
                e
              )
            );
        });
      } else {
        errors.push(
          '[GA] no reading depth data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) => errors.push('[GA] Error getting reading depth data:', e));

  return { errors, results };
}

export default async (req, res) => {
  const { startDate, endDate, tableName } = req.query;

  let result;

  if (tableName === 'ga_session_duration') {
    result = await getSessionDuration({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_pageviews') {
    result = await getPageViews({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_sessions') {
    result = await getSessions({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_referral_sessions') {
    result = await getReferralSessions({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_geo_sessions') {
    result = await getGeoSessions({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_reading_depth') {
    result = await getReadingDepth({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_reading_frequency') {
    result = await getReadingFrequency({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_newsletter_impressions') {
    result = await getNewsletterImpressions({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_subscriber') {
    result = await getSubscriberDimension({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_donor') {
    result = await getDonorDimension({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  } else if (tableName === 'ga_newsletter') {
    result = await getNewsletterDimension({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });
  }

  if (result) {
    res.status(200).json({
      name: tableName,
      startDate: startDate,
      endDate: endDate,
      status: 'OK',
      message: JSON.stringify(result),
    });
  } else {
    res.status(500).json({
      name: tableName,
      startDate: startDate,
      endDate: endDate,
      status: 'ERROR',
      message: JSON.stringify(result),
    });
  }
};
