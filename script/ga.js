const { program } = require('commander');
program.version('0.0.1');

const shared = require("./shared");

const {format} = require('date-fns');

require('dotenv').config({ path: '.env.local' })

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

async function getData(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];

  let reportRequest = {
    viewId: googleAnalyticsViewID,
    dateRanges: [
      {
        startDate: startDate,
        endDate: endDate,
      },
    ]
  };

  if (params['data'] === 'donate-clicks') {
    reportRequest['metrics'] = [
      { expression: 'ga:totalEvents' },
    ];
    reportRequest['dimensions'] = [
      { name: 'ga:eventAction' },
      { name: 'ga:eventCategory' },
      { name: 'ga:eventLabel' },
      { name: 'ga:pagePath' },
      { name: 'ga:date' },
    ];
    reportRequest['filtersExpression'] = 'ga:eventCategory==Donate';

  } else if (params['data'] === 'donors') {
    reportRequest['metrics'] = [
      { expression: 'ga:sessions', },
    ];
    reportRequest['dimensions'] = [
      { name: 'ga:dimension4', },
      { name: 'ga:date', },
    ];
  }

  const response = await analyticsreporting.reports.batchGet({
    requestBody: {
      reportRequests: [ reportRequest ],
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
    const error = new Error('No rows returned for ' + startDate);
    error.code = '404';
    throw error;
  }

  return response.data.reports[0].data.rows;
}

function storeData(params, rows) {
  rows.forEach((row) => {
    if (params['data'] === 'donate-clicks') {
      shared.hasuraInsertDonationClick({
        url: apiUrl,
        orgSlug: apiToken,
        count: row.metrics[0].values[0],
        path: shared.sanitizePath(row.dimensions[3]),
        date: row.dimensions[4],
        action: row.dimensions[0],
      }).then((result) => {
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
      shared.hasuraInsertCustomDimension({
        url: apiUrl,
        orgSlug: apiToken,
        count: 0,
        label: 'isDonor',
        dimension: 'dimension4',
        date: startDate,
      }).then((result) => {
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
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
    });
  } catch (e) {
    console.log('error getting data from GA:', e);
  }

  if (!rows) {
    console.log("No rows returned");
    return;
  }

  console.log(rows);

  try {
    storeData(params, rows);
    //   const auditResult = await shared.hasuraInsertDataImport({
    //     url: apiUrl,
    //     orgSlug: apiToken,
    //     table_name: 'ga_donation_clicks',
    //     start_date: startDate,
    //     end_date: endDate,
    //     success: true,
    //     row_count: rows.length,
    //   });

    //   console.log(auditResult);

    //   const auditStatus = auditResult.data ? 'ok' : 'error';

    //   if (auditStatus === 'error') {
    //     console.error('Failed logging data import audit for donation clicks: ' + JSON.stringify(auditResult));
    //   }
    //   console.log('Imported data for ' + params['data'] + ': ' + JSON.stringify(auditResult));
  } catch (e) {
    console.error('error importing data into hasura:', e);
  }

  // } catch(e) {
  //   console.error(e)
  // }
};

program
  .requiredOption('-d, --data <data>', 'required, data to import, ex: donate-clicks')
  .option('-s, --start-date <startDate>', 'optional, start date for analytics report from GA (YYYY-MM-DD)')
  .option('-e, --end-date <endDate>', 'optional, end date for analytics report from GA (YYYY-MM-DD)')
  .description("imports data from google analytics")
  .action( (opts) => {
    importDataFromGA(opts);
  });

program.parse(process.argv);