import {
  hasuraInsertDataImport,
  hasuraInsertReadingDepth,
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

async function getReadingDepth(params) {
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
          filtersExpression: 'ga:eventCategory==NTG Article Milestone',
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

function importReadingDepth(rows) {
  let collectedData = {};
  rows.forEach((row) => {
    let articlePath = sanitizePath(row.dimensions[3]);
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
    hasuraInsertReadingDepth({
      url: apiUrl,
      orgSlug: apiToken,
      date: cd['date'],
      path: path,
      read_25: read25,
      read_50: read50,
      read_75: read75,
      read_100: read100,
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

  if (startDate === undefined) {
    let yesterday = new Date();
    startDate = new Date(yesterday.setDate(yesterday.getDate() - 1));
  }

  if (endDate === undefined) {
    endDate = new Date();
  }
  console.log('data import reading depth:', startDate, endDate);
  let rows;
  try {
    rows = await getReadingDepth({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 'error',
      errors: 'Failed getting reading depth data from GA',
    });
  }

  try {
    importReadingDepth(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 'error',
      errors: 'Failed importing GA reading depth data into Hasura',
    });
  }

  const auditResult = await hasuraInsertDataImport({
    url: apiUrl,
    orgSlug: apiToken,
    table_name: 'ga_reading_depth',
    start_date: startDate,
    end_date: endDate,
    success: true,
  });

  const auditStatus = auditResult.data ? 'ok' : 'error';

  if (auditStatus === 'error') {
    return res.status(500).json({
      status: 'error',
      errors: 'Failed logging data import audit for reading depth data',
    });
  }

  res.status(200).json({
    name: 'ga_reading_depth',
    startDate: startDate,
    endDate: endDate,
    status: 'ok',
    audit: auditStatus,
  });
};
