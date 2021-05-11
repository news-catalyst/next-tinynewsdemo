import {
  hasuraGetDataImports,
  hasuraInsertDataImport,
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
  let orgSlug = params['orgSlug'];

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
      let successfulRun = true;

      let reports = response.data.reports;

      console.log('session duration data from', startDate, 'to', endDate);
      // console.log(JSON.stringify(reports))
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
                console.error(
                  '[GA] error inserting session duration data: ',
                  res.errors
                );
                successfulRun = false;
              } else {
                console.log(' + session duration', date, value);
              }
            })
            .catch((e) => {
              console.error(
                '[GA] Error inserting session duration data into hasura:',
                e
              );
              successfulRun = false;
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
            console.log('[GA] updated data audits table:', res);
          })
          .catch((e) =>
            console.error('[GA] Error updating data audits table:', e, res)
          );
      } else {
        console.error(
          '[GA] no session duration data found between',
          startDate,
          'and',
          endDate
        );
      }
    })
    .catch((e) =>
      console.error('[GA] Error getting session duration data:', e)
    );
}

export default async (req, res) => {
  console.log('data import api route', req.query);
  const { startDate, endDate, tableName } = req.query;

  if (tableName === 'ga_session_duration') {
    var result = getSessionDuration({
      startDate: startDate,
      endDate: endDate,
      viewID: googleAnalyticsViewID,
      apiUrl: apiUrl,
      orgSlug: apiToken,
    });

    if (result) {
      res
        .status(200)
        .json({
          name: tableName,
          startDate: startDate,
          endDate: endDate,
          status: 'OK',
          message: JSON.stringify(result),
        });
    } else if (result.errors) {
      res
        .status(500)
        .json({
          name: tableName,
          startDate: startDate,
          endDate: endDate,
          status: 'ERROR',
          message: JSON.stringify(result.errors),
        });
    }
  }
};
