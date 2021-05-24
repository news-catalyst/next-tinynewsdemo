import {
  hasuraInsertDataImport,
  hasuraInsertNewsletterImpression,
  sanitizePath,
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

async function getNewsletterImpressions(params) {
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
          filtersExpression: 'ga:eventCategory==NTG Newsletter',
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
  return response.data.reports[0].data.rows;
}

function importNewsletterImpressions(rows) {
  if (!rows) {
    const error = new Error('No rows returned for ' + startDate);
    error.code = '404';
    throw error;
  }

  rows.forEach((row) => {
    hasuraInsertNewsletterImpression({
      url: apiUrl,
      orgSlug: apiToken,
      impressions: row.metrics[0].values[0],
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
        console.log('data import ok');
      }
    });
  });
}

export default async (req, res) => {
  const { startDate, endDate } = req.query;

  console.log('data import newsletter impression data:', startDate, endDate);
  let rows;
  try {
    rows = await getNewsletterImpressions({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 'error',
      errors: 'Failed getting newsletter impressions data from GA',
    });
  }

  try {
    importNewsletterImpressions(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 'error',
      errors: 'Failed importing GA newsletter impressions data into Hasura',
    });
  }

  const auditResult = await hasuraInsertDataImport({
    url: apiUrl,
    orgSlug: apiToken,
    table_name: 'ga_newsletter_impressions',
    start_date: startDate,
    end_date: endDate,
    success: true,
  });

  const auditStatus = auditResult.data ? 'ok' : 'error';

  if (auditStatus === 'error') {
    return res.status(500).json({
      status: 'error',
      errors:
        'Failed logging data import audit for newsletter impressions data',
    });
  }

  res.status(200).json({
    name: 'ga_newsletter_impressions',
    startDate: startDate,
    endDate: endDate,
    status: 'ok',
    audit: auditStatus,
  });
};
