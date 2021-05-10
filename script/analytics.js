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

async function getReadingFrequency(startDate, endDate) {
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
            name: "ga:dimension2"
          }]
      }]
    }
  } )
  .then((response) => {
    let reports = response.data.reports;

    console.log("reading frequency data from", startDate, "to", endDate);
    // console.log(JSON.stringify(reports))
    let data = reports[0].data;

    if (data && data.rows) {
      data.rows.map( (row) => {
        let category = row.dimensions.join(' - ');
        let count = row.metrics[0].values[0];

        shared.hasuraInsertReadingFrequency({
          url: apiUrl,
          orgSlug: apiToken,
          count: count,
          date: startDate,
          category: category,
        }).then ( (res) => {
          if (res.errors) {
            console.error("[GA] error inserting reading frequency data: ", res.errors);
          } else {
            console.log(" + reading frequency ", category, count);
          }
        })
        .catch((e) => console.error("[GA] Error inserting reading frequency data into hasura:", e ));
      });
    } else {
      console.error("[GA] no reading frequency data found between", startDate, "and", endDate);
    }
  })
  .catch((e) => console.error("[GA] Error getting reading frequency:", e ));
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

async function getReadingDepth(startDate, endDate) {
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
            expression: "ga:totalEvents"
          },
        ],
        dimensions: [
          { name: 'ga:eventAction'},
          { name: 'ga:eventCategory'},
          { name: 'ga:eventLabel'},
          { name: 'ga:pagePath'},
        ],
        filtersExpression: 'ga:eventCategory==NTG Article Milestone',
      }]
    }
  } )
  .then((response) => {
    let reports = response.data.reports;

    console.log("reading depth data from", startDate, "to", endDate);
    // console.log(JSON.stringify(reports))
    let data = reports[0].data;

    if (data && data.rows) {
      let collectedData = {};
      data.rows.map( (row) => {
        let articlePath = shared.sanitizePath(row.dimensions[3]);

        if (articlePath !== '/') {
          let percentage = row.dimensions[0];
          let label = `read_${percentage.replace('%', '')}`;
          let count = parseInt(row.metrics[0].values[0]);

          // console.log(`* ${articlePath} ${label} ${count}`)
          if (!collectedData[articlePath]) {
            collectedData[articlePath] = {};
          }
          if (!collectedData[articlePath][label]) {
            collectedData[articlePath][label] = count;
          } else {
            collectedData[articlePath][label] += count;
          }

          collectedData[articlePath]['date'] = startDate;
        }
      });
      // console.log("collectedData:", collectedData);
      Object.keys(collectedData).map((path) => {
        let cd = collectedData[path];
        let read25 = cd['read_25'] || 0;
        let read50 = cd['read_50'] || 0;
        let read75 = cd['read_75'] || 0;
        let read100 = cd['read_100'] || 0;
        shared.hasuraInsertReadingDepth({
          url: apiUrl,
          orgSlug: apiToken,
          date: cd['date'],
          path: path,
          read_25: read25,
          read_50: read50,
          read_75: read75,
          read_100: read100,
        }).then ( (res) => {
          if (res.errors) {
            console.error("[GA] error inserting reading depth data: ", res.errors);
          } else {
            console.log(" + reading depth", cd['date'], path);
          }
        })
        .catch((e) => console.error("[GA] Error inserting reading depth data into hasura:", e ));

      })
    } else {
      console.error("[GA] no reading depth data found between", startDate, "and", endDate);
    }
  })
  .catch((e) => console.error("[GA] Error getting session duration data:", e ));
}

program
    // .requiredOption('-v, --view <viewId>', 'view id for the property profile in GA')
    .requiredOption('-s, --startDate <startDate>', 'start date YYYY-MM-DD')
    .requiredOption('-e, --endDate <endDate>', 'end date YYYY-MM-DD')
    .description("loads metrics data from google analytics into hasura")
    .action( (opts) => {
      getReadingFrequency(opts.startDate, opts.endDate);
      // getReadingDepth(opts.startDate, opts.endDate);
      // getPageViews(opts.startDate, opts.endDate);
      // getSessions(opts.startDate, opts.endDate);
      // getGeoSessions(opts.startDate, opts.endDate);
      // getReferralSessions(opts.startDate, opts.endDate);
      // getSessionDuration(opts.startDate, opts.endDate);
    });

program.parse(process.argv);
