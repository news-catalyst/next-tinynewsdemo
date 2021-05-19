import {
  hasuraInsertDataImport,
  hasuraInsertSession,
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

async function getSessions(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  try {
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
    });

    let insertPromises = [];
    if (
      !response ||
      !response.data ||
      !response.data.reports ||
      !response.data.reports[0] ||
      !response.data.reports[0].data ||
      !response.data.reports[0].data.rows
    ) {
      console.log(startDate, '0 rows');
      insertPromises.push(
        hasuraInsertSession({
          url: apiUrl,
          orgSlug: apiToken,
          count: 0,
          date: startDate,
        }).then((result) => {
          if (result.errors) {
            return { status: 'error', errors: result.errors };
          } else {
            return { status: 'ok', result: result, errors: [] };
          }
        })
      );
    } else {
      response.data.reports[0].data.rows.forEach((row) => {
        let sessionDate = row.dimensions[0];
        let sessionCount = row.metrics[0].values[0];
        console.log(sessionDate, sessionCount);

        insertPromises.push(
          hasuraInsertSession({
            url: apiUrl,
            orgSlug: apiToken,
            count: sessionCount,
            date: sessionDate,
          }).then((result) => {
            let statusMessage = `${sessionDate} - ${sessionCount}`;
            if (result.errors) {
              return { status: 'error', errors: result.errors };
            } else {
              return { status: 'ok', result: statusMessage, errors: [] };
            }
          })
        );
      });
    }

    let returnResults = { errors: [], results: [] };

    for await (let result of insertPromises) {
      if (result['errors'] && result['errors'].length > 0) {
        returnResults['errors'].push(result['errors']);
      }
      if (result['result']) {
        returnResults['results'].push(result['result']);
      }
    }
    return returnResults;
  } catch (e) {
    console.error('caught error:', e);
    return { errors: [e] };
  }
}

export default async (req, res) => {
  const { startDate, endDate } = req.query;

  console.log('data import page views:', startDate, endDate);
  const results = await getSessions({
    startDate: startDate,
    endDate: endDate,
    viewID: googleAnalyticsViewID,
    apiUrl: apiUrl,
  });

  let resultNotes = results['results'];

  let successFlag = true;
  if (results.errors && results.errors.length > 0) {
    successFlag = false;
    resultNotes = results.errors;
  }

  const auditResult = await hasuraInsertDataImport({
    url: apiUrl,
    orgSlug: apiToken,
    table_name: 'ga_sessions',
    start_date: startDate,
    end_date: endDate,
    success: successFlag,
    notes: JSON.stringify(resultNotes),
  });

  const auditStatus = auditResult.data ? 'ok' : 'error';

  if (results.errors && results.errors.length > 0) {
    return res
      .status(500)
      .json({ status: 'error', errors: resultNotes, audit: auditStatus });
  }

  res.status(200).json({
    name: 'ga_sessions',
    startDate: startDate,
    endDate: endDate,
    status: 'ok',
    message: JSON.stringify(resultNotes),
    audit: auditStatus,
  });
};
