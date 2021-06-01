import {
  hasuraInsertDataImport,
  hasuraInsertDonationClick,
  sanitizePath,
} from '../../../lib/analytics';
import { format } from 'date-fns';

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

async function getDonationClicks(params) {
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
            { name: 'ga:eventAction' },
            { name: 'ga:eventCategory' },
            { name: 'ga:eventLabel' },
            { name: 'ga:pagePath' },
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

function importDonateClicks(rows) {
  rows.forEach((row) => {
    hasuraInsertDonationClick({
      url: apiUrl,
      orgSlug: apiToken,
      count: row.metrics[0].values[0],
      path: sanitizePath(row.dimensions[3]),
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
  });
}

export default async (req, res) => {
  let { startDate, endDate } = req.query;

  if (startDate === undefined) {
    let yesterday = new Date();
    startDate = new Date(yesterday.setDate(yesterday.getDate() - 1));
    startDate = format(startDate, 'yyyy-MM-dd');
  }

  if (endDate === undefined) {
    endDate = new Date();
    endDate = format(endDate, 'yyyy-MM-dd');
  }
  console.log('data import donation click data:', startDate, endDate);

  let rows;

  try {
    rows = await getDonationClicks({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
    });
  } catch (e) {
    console.log('error getting data from GA:', e);
    return res.status(e.code).json({
      status: 'error',
      errors: e.message,
    });
  }

  try {
    importDonateClicks(rows);
  } catch (e) {
    console.error('error importing data into hasura:', e);
    let code = 500;
    if (e && e.code) {
      code = e.code;
      console.log('returning error response with status code' + code);
    }
    return res.status(code).json({
      status: 'error',
      errors: e.message,
    });
  }

  const auditResult = await hasuraInsertDataImport({
    url: apiUrl,
    orgSlug: apiToken,
    table_name: 'ga_donation_clicks',
    start_date: startDate,
    end_date: endDate,
    success: true,
  });

  const auditStatus = auditResult.data ? 'ok' : 'error';

  if (auditStatus === 'error') {
    return res.status(500).json({
      status: 'error',
      errors: 'Failed logging data import audit for donation clicks',
    });
  }

  res.status(200).json({
    name: 'ga_donation_clicks',
    startDate: startDate,
    endDate: endDate,
    status: 'ok',
    audit: auditStatus,
  });
};
