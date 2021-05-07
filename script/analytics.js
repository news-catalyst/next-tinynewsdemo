#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const { program } = require('commander');
program.version('0.0.1');

const { google } = require("googleapis");
const credentials = require("./credentials.json");
const scopes = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/analytics", "https://www.googleapis.com/auth/analytics.edit"];
const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);
const analyticsreporting = google.analyticsreporting({version: "v4", auth})
// const googleAnalyticsAccountID = process.env.GA_ACCOUNT_ID;
const googleAnalyticsViewID = process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID;

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

const shared = require("./shared");

async function getSessionDuration(startDate, endDate) {
  analyticsreporting.reports.batchGet( {
    requestBody: {
      reportRequests: [
      {
        viewId: googleAnalyticsViewID,
        dateRanges:[
          {
            startDate: startDate,
            endDate: endDate
          }],
        metrics:[
          {
            expression: "ga:avgSessionDuration"
          },
        ],
        dimensions: [
          {
            name: "ga:date"
          }
        ]
      }]
    }
  } )
  .then((response) => {
    let reports = response.data.reports;

    console.log("session duration data from", startDate, "to", endDate);
    // console.log(JSON.stringify(reports))
    let data = reports[0].data;

    if (data && data.rows) {
      data.rows.map( (row) => {
        let date = row.dimensions[0];
        let value = row.metrics[0].values[0];

        shared.hasuraInsertSessionDuration({
          url: apiUrl,
          orgSlug: apiToken,
          seconds: value,
          date: date,
        }).then ( (res) => {
          if (res.errors) {
            console.error("[GA] error inserting session duration data: ", res.errors);
          } else {
            console.log(" + session duration", date, value);
          }
        })
        .catch((e) => console.error("[GA] Error inserting session duration data into hasura:", e ));
      });
    } else {
      console.error("[GA] no session duration data found between", startDate, "and", endDate);
    }
  })
  .catch((e) => console.error("[GA] Error getting session duration data:", e ));
}

async function getReferralSessions(startDate, endDate) {
  analyticsreporting.reports.batchGet( {
    requestBody: {
      reportRequests: [
      {
        viewId: googleAnalyticsViewID,
        dateRanges:[
          {
            startDate: startDate,
            endDate: endDate
          }],
        metrics:[
          {
            expression: "ga:sessions"
          },
        ],
        dimensions: [
          {
            name: "ga:source"
          }
        ]
      }]
    }
  } )
  .then((response) => {
    let reports = response.data.reports;

    console.log("referral sessions data from", startDate, "to", endDate);
    // console.log(JSON.stringify(reports))
    let data = reports[0].data;

    if (data && data.rows) {
      data.rows.map( (row) => {
        let source = row.dimensions[0];
        let value = row.metrics[0].values[0];

        shared.hasuraInsertReferralSession({
          url: apiUrl,
          orgSlug: apiToken,
          count: value,
          source: source,
          date: startDate,
        }).then ( (res) => {
          if (res.errors) {
            console.error("[GA] error inserting referral session data: ", res.errors);
          } else {
            console.log(" + referral session ", source, value, startDate);
          }
        })
        .catch((e) => console.error("[GA] Error inserting referral session data into hasura:", e ));
      });
    } else {
      console.error("[GA] no referral session data found between", startDate, "and", endDate);
    }
  })
  .catch((e) => console.error("[GA] Error getting referral sessions:", e ));
}

async function getGeoSessions(startDate, endDate) {
  analyticsreporting.reports.batchGet( {
    requestBody: {
      reportRequests: [
      {
        viewId: googleAnalyticsViewID,
        dateRanges:[
          {
            startDate: startDate,
            endDate: endDate
          }],
        metrics:[
          {
            expression: "ga:sessions"
          },
        ],
        dimensions: [
          {
            name: "ga:country"
          },
          {
            name: "ga:region"
          }
        ]
      }]
    }
  } )
  .then((response) => {
    let reports = response.data.reports;

    console.log("geo sessions data from", startDate, "to", endDate);
    // console.log(JSON.stringify(reports))
    let data = reports[0].data;

    if (data && data.rows) {
      data.rows.map( (row) => {
        let region = row.dimensions.join(" - ");
        let value = row.metrics[0].values[0];

        shared.hasuraInsertGeoSession({
          url: apiUrl,
          orgSlug: apiToken,
          count: value,
          region: region,
          date: startDate,
        }).then ( (res) => {
          if (res.errors) {
            console.error("[GA] error inserting geo session data: ", res.errors);
          } else {
            console.log(" + geo session ", region, value, endDate);
          }
        })
        .catch((e) => console.error("[GA] Error inserting geo session data into hasura:", e ));
      });
    } else {
      console.error("[GA] no geo session data found between", startDate, "and", endDate);
    }
  })
  .catch((e) => console.error("[GA] Error getting geo sessions:", e ));
}

async function getSessions(startDate, endDate) {
  analyticsreporting.reports.batchGet( {
    requestBody: {
      reportRequests: [
      {
        viewId: googleAnalyticsViewID,
        dateRanges:[
          {
            startDate: startDate,
            endDate: endDate
          }],
        metrics:[
          {
            expression: "ga:sessions"
          }],
        dimensions: [
          {
            name: "ga:date"
          }]
      }]
    }
  } )
  .then((response) => {
    let reports = response.data.reports;

    console.log("sessions data from", startDate, "to", endDate);
    // console.log(JSON.stringify(reports))
    let data = reports[0].data;

    if (data && data.rows) {
      data.rows.map( (row) => {
        let sessionDate = row.dimensions[0];
        let value = row.metrics[0].values[0];

        shared.hasuraInsertSession({
          url: apiUrl,
          orgSlug: apiToken,
          count: value,
          date: sessionDate,
        }).then ( (res) => {
          if (res.errors) {
            console.error("[GA] error inserting session data: ", sessionDate, value, JSON.stringify(row), res.errors);
          } else {
          console.log(" + session ", sessionDate, value);
          }
        })
        .catch((e) => console.error("[GA] Error inserting session data into hasura:", e ));
      });
    } else {
      console.error("[GA] no session data found between", startDate, "and", endDate);
    }
  })
  .catch((e) => console.error("[GA] Error getting sessions:", e ));
}

async function getPageViews(startDate, endDate) {
  analyticsreporting.reports.batchGet( {
    requestBody: {
      reportRequests: [
      {
        viewId: googleAnalyticsViewID,
        dateRanges:[
          {
            startDate: startDate,
            endDate: endDate
          }],
        metrics:[
          {
            expression: "ga:pageviews"
          }],
        dimensions: [
          {
            name: "ga:pagePath"
          }]
      }]
    }
  } )
  .then((response) => {
    let reports = response.data.reports;

    console.log("page view data from", startDate, "to", endDate);
    // console.log(JSON.stringify(reports))
    let data = reports[0].data;

    if (data && data.rows) {
      data.rows.map( (row) => {
        let path = row.dimensions[0];
        let value = row.metrics[0].values[0];

        shared.hasuraInsertPageView({
          url: apiUrl,
          orgSlug: apiToken,
          count: value,
          date: startDate,
          path: path,
        }).then ( (res) => {
          if (res.errors) {
            console.error("[GA] error inserting pageview data: ", res.errors);
          } else {
            console.log(" + pageview ", path, value);
          }
        })
        .catch((e) => console.error("[GA] Error inserting page view data into hasura:", e ));
      });
    } else {
      console.error("[GA] no page view data found between", startDate, "and", endDate);
    }
  })
  .catch((e) => console.error("[GA] Error getting page views:", e ));
}

program
    // .requiredOption('-v, --view <viewId>', 'view id for the property profile in GA')
    .requiredOption('-s, --startDate <startDate>', 'start date YYYY-MM-DD')
    .requiredOption('-e, --endDate <endDate>', 'end date YYYY-MM-DD')
    .description("loads metrics data from google analytics into hasura")
    .action( (opts) => {
      // getPageViews(opts.startDate, opts.endDate);
      // getSessions(opts.startDate, opts.endDate);
      // getGeoSessions(opts.startDate, opts.endDate);
      // getReferralSessions(opts.startDate, opts.endDate);
      getSessionDuration(opts.startDate, opts.endDate);
    });

program.parse(process.argv);
