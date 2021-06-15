import {
  hasuraInsertDataImport,
  hasuraInsertSessionDuration,
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

async function getSessionDuration(params) {
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

function importSessionDuration(rows) {
  rows.forEach((row) => {
    hasuraInsertSessionDuration({
      url: apiUrl,
      orgSlug: apiToken,
      seconds: row.metrics[0].values[0],
      date: row.dimensions[0],
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

export default async function Handler(req, res) {
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

  console.log('data import:', startDate, endDate);

  let rows;

  try {
    rows = await getSessionDuration({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
    });
  } catch (e) {
    console.error(e);
    return res.status(e.code).json({
      status: 'error',
      errors: e.message,
    });
  }

  try {
    importSessionDuration(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 'error',
      errors: 'Failed importing GA session durations into Hasura',
    });
  }

  const auditResult = await hasuraInsertDataImport({
    url: apiUrl,
    orgSlug: apiToken,
    table_name: 'ga_session_duration',
    start_date: startDate,
    end_date: endDate,
    success: true,
    row_count: rows.length,
  });

  const auditStatus = auditResult.data ? 'ok' : 'error';

  if (auditStatus === 'error') {
    return res.status(500).json({
      status: 'error',
      errors:
        'Failed logging data import audit: ' + JSON.stringify(auditResult),
    });
  }

  res.status(200).json({
    name: 'ga_session_duration',
    startDate: startDate,
    endDate: endDate,
    status: 'OK',
    audit: JSON.stringify(auditResult),
  });
}
