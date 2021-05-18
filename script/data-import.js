const { program } = require('commander');
program.version('0.0.1');

const fetch = require("node-fetch");
require('dotenv').config({ path: '.env.local' })

const {format} = require('date-fns');

const baseURL = process.env.SITE_URL + "/api/import/";
const endpoints = [
  "donate-clicks", 
  "donor-reading-frequency", 
  "donors", 
  "geo-sessions", 
  "newsletter-impressions", 
  "newsletters", 
  "page-views", 
  "reading-depth", 
  "reading-frequency", 
  "referral-sessions", 
  "session-duration", 
  "sessions", 
  "subscribers"
];

async function runDataImport(startDate, endDate) {
  console.log("running data import:", startDate, endDate);

  for await (let endpoint of endpoints) {
    let endpointURL = baseURL + endpoint;
    endpointURL += `?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`;

    console.log(endpointURL);

    try {
      let result = await fetch(endpointURL, {
        method: "GET",
      })

      let resultData = await result.json();

      console.log(resultData);

    } catch(e) {
      console.error("error running data import", endpointURL, e)
    }
  };
}

program
  .option('-s, --start-date <startDate>', 'start of the date range')
  .option('-e, --end-date <endDate>', 'end of the date range')
  .description("imports daily GA data for each date in the specified range")
  .action( (opts) => {
    let startDate;
    if (opts.startDate === undefined) {
      let yesterday = new Date(); 
      startDate = new Date(yesterday.setDate(yesterday.getDate() - 1));
    } else {
      startDate = new Date(opts.startDate);
    }

    let endDate;
    if (opts.endDate === undefined) {
      let today = new Date(); 
      endDate = new Date(today.setDate(today.getDate() - 1));
    } else {
      endDate = new Date(opts.endDate);
    }

    for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      let sd = new Date(d);
      let ed = new Date(d.setDate(d.getDate() + 1));
      // console.log("running data import for", sd, ed);
      runDataImport(sd, ed);
    }

  });

program.parse(process.argv);