import {
  hasuraInsertDataImport,
  hasuraInsertDonorReadingFrequency,
} from '../../../lib/analytics';

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

async function getDonorReadingFrequency(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];

  const response = await analyticsreporting.reports.batchGet({
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
          filtersExpression: 'ga:eventCategory==Donate',
        },
      ],
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
    error.code = response;
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
    console.log('No data from GA for donor reading frequency on ' + startDate);
    const error = new Error('No rows returned for ' + startDate);
    error.code = '404';
    throw error;
  }
  return response.data.reports[0].data.rows;
}

function importDonorReadingFrequency(rows) {
  let insertPromises = [];
  console.log('GA rows:', rows.length);

  rows.forEach((row) => {
    let frequency = row.dimensions[3];
    let date = row.dimensions[4];
    let count = row.metrics[0].values[0];
    insertPromises.push(
      hasuraInsertDonorReadingFrequency({
        url: apiUrl,
        orgSlug: apiToken,
        count: count,
        label: frequency,
        date: date,
      }).then((result) => {
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
      })
    );
  });
}

export default async (req, res) => {
  const { startDate, endDate } = req.query;

  if (startDate === undefined) {
    let yesterday = new Date();
    startDate = new Date(yesterday.setDate(yesterday.getDate() - 1));
  }

  if (endDate === undefined) {
    endDate = new Date();
  }
  console.log('data import donor reading frequency data:', startDate, endDate);
  let rows;

  try {
    rows = await getDonorReadingFrequency({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 'error',
      errors: 'Failed getting donor reading frequency data from GA',
    });
  }

  try {
    importDonorReadingFrequency(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 'error',
      errors: 'Failed importing GA donor reading frequency data into Hasura',
    });
  }

  const auditResult = await hasuraInsertDataImport({
    url: apiUrl,
    orgSlug: apiToken,
    table_name: 'ga_donor_reading_frequency',
    start_date: startDate,
    end_date: endDate,
    success: true,
    notes: JSON.stringify(resultNotes),
    row_count: results.rowCount,
  });

  const auditStatus = auditResult.data ? 'ok' : 'error';

  if (auditStatus === 'error') {
    return res.status(500).json({
      status: 'error',
      errors:
        'Failed logging data import audit for donor reading frequency data',
    });
  }

  res.status(200).json({
    name: 'ga_donor_reading_frequency',
    startDate: startDate,
    endDate: endDate,
    status: 'ok',
    message: resultNotes,
    audit: auditStatus,
    rowCount: results.rowCount,
  });
};
