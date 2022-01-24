const { program } = require('commander');
program.version('0.0.1');

const core = require('@actions/core');
const shared = require('./shared');
const { format } = require('date-fns');

const { google } = require('googleapis');
const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/analytics',
  'https://www.googleapis.com/auth/analytics.edit',
];

async function getData(params) {
  if (params['requireDotEnv']) {
    require('dotenv').config({ path: '.env.local' });
  }

  const googleAnalyticsViewID = process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID;
  const credsEmail = process.env.GOOGLE_CREDENTIALS_EMAIL;
  const credsPrivateKey = process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY.replace(
    /\\n/gm,
    '\n'
  );

  console.log(
    'authenticating with google:',
    credsEmail,
    credsPrivateKey,
    scopes
  );
  const auth = new google.auth.JWT(credsEmail, null, credsPrivateKey, scopes);
  const analyticsreporting = google.analyticsreporting({ version: 'v4', auth });
  let startDate = params['startDate'];
  let endDate = params['endDate'];

  let reportRequest = {
    viewId: googleAnalyticsViewID,
    dateRanges: [
      {
        startDate: startDate,
        endDate: endDate,
      },
    ],
  };

  if (params['data'] === 'article-sessions') {
    reportRequest['metrics'] = [{ expression: 'ga:sessions' }];
    reportRequest['dimensions'] = [
      { name: 'ga:pagePath' },
      { name: 'ga:date' },
    ];
  } else if (params['data'] === 'donate-clicks') {
    reportRequest['metrics'] = [{ expression: 'ga:totalEvents' }];
    reportRequest['dimensions'] = [
      { name: 'ga:eventAction' },
      { name: 'ga:eventCategory' },
      { name: 'ga:eventLabel' },
      { name: 'ga:pagePath' },
      { name: 'ga:date' },
    ];
    reportRequest['filtersExpression'] = 'ga:eventCategory==Donate';
  } else if (params['data'] === 'donor-reading-frequency') {
    reportRequest['metrics'] = [{ expression: 'ga:totalEvents' }];
    reportRequest['dimensions'] = [
      { name: 'ga:eventCategory' },
      { name: 'ga:eventAction' },
      { name: 'ga:eventLabel' },
      { name: 'ga:dimension2' },
      { name: 'ga:date' },
    ];
    reportRequest['filtersExpression'] = 'ga:eventCategory==Donate';
  } else if (params['data'] === 'donors') {
    reportRequest['metrics'] = [{ expression: 'ga:sessions' }];
    reportRequest['dimensions'] = [
      { name: 'ga:dimension4' },
      { name: 'ga:date' },
    ];
  } else if (params['data'] === 'geo-sessions') {
    reportRequest['metrics'] = [{ expression: 'ga:sessions' }];
    reportRequest['dimensions'] = [
      { name: 'ga:country' },
      { name: 'ga:region' },
      { name: 'ga:date' },
    ];
  } else if (params['data'] === 'newsletter-impressions') {
    reportRequest['metrics'] = [{ expression: 'ga:totalEvents' }];
    reportRequest['dimensions'] = [
      { name: 'ga:eventAction' },
      { name: 'ga:eventCategory' },
      { name: 'ga:eventLabel' },
      { name: 'ga:pagePath' },
      { name: 'ga:date' },
    ];
    reportRequest['filtersExpression'] = 'ga:eventCategory==NTG Newsletter';
  } else if (params['data'] === 'newsletters') {
    reportRequest['metrics'] = [{ expression: 'ga:totalEvents' }];
    reportRequest['dimensions'] = [
      { name: 'ga:eventCategory' },
      { name: 'ga:eventAction' },
      { name: 'ga:eventLabel' },
      { name: 'ga:dimension2' },
      { name: 'ga:date' },
    ];
    reportRequest['filtersExpression'] =
      'ga:eventCategory==NTG Newsletter;ga:eventAction==Newsletter Signup';
  } else if (params['data'] === 'page-views') {
    reportRequest['metrics'] = [{ expression: 'ga:pageViews' }];
    reportRequest['dimensions'] = [
      { name: 'ga:pagePath' },
      { name: 'ga:date' },
    ];
  } else if (params['data'] === 'reading-depth') {
    reportRequest['metrics'] = [{ expression: 'ga:totalEvents' }];
    reportRequest['dimensions'] = [
      { name: 'ga:eventAction' },
      { name: 'ga:eventCategory' },
      { name: 'ga:eventLabel' },
      { name: 'ga:pagePath' },
      { name: 'ga:date' },
    ];
    reportRequest['filtersExpression'] =
      'ga:eventCategory==NTG Article Milestone';
  } else if (params['data'] === 'reading-frequency') {
    reportRequest['metrics'] = [{ expression: 'ga:pageviews' }];
    reportRequest['dimensions'] = [
      { name: 'ga:dimension2' },
      { name: 'ga:date' },
    ];
  } else if (params['data'] === 'referral-sessions') {
    reportRequest['metrics'] = [{ expression: 'ga:sessions' }];
    reportRequest['dimensions'] = [{ name: 'ga:source' }, { name: 'ga:date' }];
  } else if (params['data'] === 'session-duration') {
    reportRequest['metrics'] = [{ expression: 'ga:avgSessionDuration' }];
    reportRequest['dimensions'] = [{ name: 'ga:date' }];
  } else if (params['data'] === 'sessions') {
    reportRequest['metrics'] = [{ expression: 'ga:sessions' }];
    reportRequest['dimensions'] = [{ name: 'ga:date' }];
  } else if (params['data'] === 'subscribers') {
    reportRequest['metrics'] = [{ expression: 'ga:sessions' }];
    reportRequest['dimensions'] = [
      { name: 'ga:dimension5' },
      { name: 'ga:date' },
    ];
  } else {
    throw Error('Unknown table:', params['data']);
  }

  const response = await analyticsreporting.reports.batchGet({
    requestBody: {
      reportRequests: [reportRequest],
    },
  });

  if (
    response.status !== 404 &&
    (response.status > 299 || response.status < 200)
  ) {
    const error = new Error(
      'Google Analytics API returned an error: (' +
        response.status +
        ') ' +
        response.statusText
    );
    console.error(response);
    error.code = response.status;
    error.message = response.statusText;
    throw error;
  }

  if (
    !response ||
    !response.data ||
    !response.data.reports ||
    !response.data.reports[0] ||
    !response.data.reports[0].data ||
    !response.data.reports[0].data.rows
  ) {
    console.error('No rows returned for ' + startDate);
    return [];
  }

  return response.data.reports[0].data.rows;
}

function storeData(params, rows) {
  if (params['requireDotEnv']) {
    require('dotenv').config({ path: '.env.local' });
  }
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  if (params['data'] === 'reading-frequency') {
    let objects = [];
    rows.forEach((row) => {
      objects.push({
        count: row.metrics[0].values[0],
        category: row.dimensions[0],
        date: row.dimensions[1],
      });
    });

    shared
      .hasuraInsertReadingFrequency({
        url: apiUrl,
        orgSlug: apiToken,
        objects: objects,
      })
      .then((result) => {
        console.log('hasura insert result:', result);
        if (result.errors) {
          const error = new Error(
            'Error inserting data into hasura',
            result.errors
          );
          error.code = '500';
          throw error;
        } else {
          console.log('data import ok');
        }
      });
    return;
  }

  if (params['data'] === 'reading-depth') {
    let collectedData = {};
    rows.forEach((row) => {
      let articlePath = shared.sanitizePath(row.dimensions[3]);
      let date = row.dimensions[4];

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

        collectedData[articlePath]['date'] = date;
      }
    });
    Object.keys(collectedData).map((path) => {
      let cd = collectedData[path];
      let read25 = cd['read_25'] || 0;
      let read50 = cd['read_50'] || 0;
      let read75 = cd['read_75'] || 0;
      let read100 = cd['read_100'] || 0;
      shared
        .hasuraInsertReadingDepth({
          url: apiUrl,
          orgSlug: apiToken,
          date: cd['date'],
          path: path,
          read_25: read25,
          read_50: read50,
          read_75: read75,
          read_100: read100,
        })
        .then((result) => {
          console.log('hasura insert result:', result);
          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data import ok');
          }
        });
    });
    return;
  }

  rows.forEach((row) => {
    if (params['data'] === 'donate-clicks') {
      shared
        .hasuraInsertDonationClick({
          url: apiUrl,
          orgSlug: apiToken,
          count: row.metrics[0].values[0],
          path: shared.sanitizePath(row.dimensions[3]),
          date: row.dimensions[4],
          action: row.dimensions[0],
        })
        .then((result) => {
          console.log('hasura insert result:', result);
          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data insert ok');
          }
        });
    } else if (params['data'] === 'donors') {
      shared
        .hasuraInsertCustomDimension({
          url: apiUrl,
          orgSlug: apiToken,
          count: 0,
          label: 'isDonor',
          dimension: 'dimension4',
          date: startDate,
        })
        .then((result) => {
          console.log('hasura insert result:', result);
          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data insert ok');
          }
        });
    } else if (params['data'] === 'geo-sessions') {
      shared
        .hasuraInsertGeoSession({
          url: apiUrl,
          orgSlug: apiToken,
          region: `${row.dimensions[0]}-${row.dimensions[1]}`,
          count: row.metrics[0].values[0],
          date: row.dimensions[2],
        })
        .then((result) => {
          console.log('hasura insert result:', result);
          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data import ok');
          }
        });
    } else if (params['data'] === 'newsletter-impressions') {
      shared
        .hasuraInsertNewsletterImpression({
          url: apiUrl,
          orgSlug: apiToken,
          impressions: row.metrics[0].values[0],
          path: shared.sanitizePath(row.dimensions[3]),
          date: row.dimensions[4],
          action: row.dimensions[0],
        })
        .then((result) => {
          console.log('hasura insert result:', result);
          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data import ok');
          }
        });
    } else if (params['data'] === 'newsletters') {
      shared
        .hasuraInsertCustomDimension({
          url: apiUrl,
          orgSlug: apiToken,
          count: row.metrics[0].values[0],
          date: row.dimensions[4],
          label: row.dimensions[3],
          dimension: 'dimension2',
        })
        .then((result) => {
          console.log('hasura insert result:', result);
          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data import ok');
          }
        });
    } else if (params['data'] === 'page-views') {
      shared
        .hasuraInsertPageView({
          url: apiUrl,
          orgSlug: apiToken,
          count: row.metrics[0].values[0],
          date: row.dimensions[1],
          path: shared.sanitizePath(row.dimensions[0]),
        })
        .then((result) => {
          console.log('hasura insert result:', result);
          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data import ok');
          }
        });
    } else if (params['data'] === 'article-sessions') {
      let path = shared.sanitizePath(row.dimensions[0]);
      let sessionDate = row.dimensions[1];
      let sessionCount = row.metrics[0].values[0];
      let category;

      if (path.match(/^\/articles/)) {
        let documentType = 'article';
        // parse the category (slug) out of the article path
        let pathMatcher = new RegExp(/^\/articles\/([^\/]+)\//, 'mi');
        const matches = path.match(pathMatcher);
        if (matches) {
          category = matches[1];
          // console.log(sessionDate, category, sessionCount, path);
          shared
            .hasuraInsertArticleSession({
              url: apiUrl,
              orgSlug: apiToken,
              count: sessionCount,
              date: sessionDate,
              path: path,
              category: category,
              document_type: documentType,
            })
            .then((result) => {
              console.log('hasura insert result:', result);
              if (result.errors) {
                const error = new Error(
                  'Error inserting data into hasura',
                  result.errors
                );
                error.code = '500';
                throw error;
              } else {
                console.log('data import ok');
              }
            });
        }
      }
    } else if (params['data'] === 'referral-sessions') {
      shared
        .hasuraInsertReferralSession({
          url: apiUrl,
          orgSlug: apiToken,
          count: row.metrics[0].values[0],
          date: row.dimensions[1],
          source: row.dimensions[0],
        })
        .then((result) => {
          console.log('hasura insert result:', result);

          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data import ok');
          }
        });
    } else if (params['data'] === 'session-duration') {
      shared
        .hasuraInsertSessionDuration({
          url: apiUrl,
          orgSlug: apiToken,
          seconds: row.metrics[0].values[0],
          date: row.dimensions[0],
        })
        .then((result) => {
          console.log('hasura insert result:', result);
          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data import ok');
          }
        });
    } else if (params['data'] === 'sessions') {
      shared
        .hasuraInsertSession({
          url: apiUrl,
          orgSlug: apiToken,
          count: row.metrics[0].values[0],
          date: row.dimensions[0],
        })
        .then((result) => {
          console.log('hasura insert result:', result);

          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data import ok');
          }
        });
    } else if (params['data'] === 'subscribers') {
      shared
        .hasuraInsertCustomDimension({
          url: apiUrl,
          orgSlug: apiToken,
          count: row.metrics[0].values[0],
          label: 'isSubscriber',
          dimension: 'dimension5',
          date: row.dimensions[1],
        })
        .then((result) => {
          console.log('hasura insert result:', result);

          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data import ok');
          }
        });
    } else if (params['data'] === 'donor-reading-frequency') {
      shared
        .hasuraInsertDonorReadingFrequency({
          url: apiUrl,
          orgSlug: apiToken,
          count: row.metrics[0].values[0],
          label: row.dimensions[3],
          date: row.dimensions[4],
        })
        .then((result) => {
          console.log('hasura insert result:', result);

          if (result.errors) {
            const error = new Error(
              'Error inserting data into hasura',
              result.errors
            );
            error.code = '500';
            throw error;
          } else {
            console.log('data insert ok');
          }
        });
    }
  });
}

async function importDataFromGA(params) {
  if (params['requireDotEnv']) {
    require('dotenv').config({ path: '.env.local' });
  }

  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let { startDate, endDate } = params;

  if (startDate === undefined) {
    let yesterday = new Date();
    startDate = new Date(yesterday.setDate(yesterday.getDate() - 1));
    startDate = format(startDate, 'yyyy-MM-dd');
  }

  if (endDate === undefined) {
    endDate = new Date();
    endDate = format(endDate, 'yyyy-MM-dd');
  }
  console.log('data import ' + params['data'] + ':', startDate, endDate);

  let rows;

  try {
    rows = await getData({
      startDate: startDate,
      endDate: endDate,
      data: params['data'],
      // viewID: googleAnalyticsViewID,
      // apiUrl: apiUrl,
      requireDotEnv: params['requireDotEnv'],
    });
  } catch (e) {
    console.log('error getting data from GA:', e);
    core.setFailed(`Action failed with error ${e}`);
  }

  if (!rows || (rows && rows.length <= 0)) {
    return;
  }

  console.log(JSON.stringify(rows));

  try {
    storeData(params, rows);

    shared
      .hasuraInsertDataImport({
        orgSlug: apiToken,
        url: apiUrl,
        end_date: endDate,
        start_date: startDate,
        table_name: params['data'],
        success: true,
        row_count: rows.length,
      })
      .then((result) => {
        if (result.errors) {
          console.error(
            'error storing data import status:',
            JSON.stringify(result.errors)
          );
          core.setFailed(`Action failed with error ${result.errors}`);
        } else {
          console.log('stored data import status:', JSON.stringify(result));
        }
      });
  } catch (e) {
    console.error('error importing data into hasura:', e);
    shared
      .hasuraInsertDataImport({
        url: apiUrl,
        orgSlug: apiToken,
        end_date: endDate,
        start_date: startDate,
        table_name: params['data'],
        success: false,
        row_count: 0,
        notes: JSON.stringify(e),
      })
      .then((result) => {
        console.log('stored data import status:', result);
      });
    throw e;
  }
}

program
  .requiredOption(
    '-d, --data <data>',
    'required, data to import, ex: donate-clicks'
  )
  .option(
    '-r, --requireDotEnv',
    'optional, require dotenv when running on localhost'
  )
  .option(
    '-s, --start-date <startDate>',
    'optional, start date for analytics report from GA (YYYY-MM-DD)'
  )
  .option(
    '-e, --end-date <endDate>',
    'optional, end date for analytics report from GA (YYYY-MM-DD)'
  )
  .description('imports data from google analytics')
  .action((opts) => {
    try {
      importDataFromGA(opts);
    } catch (e) {
      core.setFailed(`Action failed with error ${e}`);
    }
  });

program.parse(process.argv);
