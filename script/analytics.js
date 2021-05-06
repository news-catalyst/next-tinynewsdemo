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
          console.log(" + session ", sessionDate, value);
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
          date: endDate,
          path: path,
        }).then ( (res) => {
          console.log(" + pageview ", path, value);
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
      getPageViews(opts.startDate, opts.endDate);
      getSessions(opts.startDate, opts.endDate);
    });

program.parse(process.argv);
