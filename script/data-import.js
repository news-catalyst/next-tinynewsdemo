const { program } = require('commander'); 
program.version('0.0.1');

const fetch = require("node-fetch");
require('dotenv').config({ path: '.env.local' })

const baseURL = process.env.SITE_URL + "/api/import/";
const endpoints = ["donors", "geo-sessions", "newsletter-impressions", "newsletters", "page-views", "reading-depth", "reading-frequency", "referral-sessions", "session-duration", "sessions", "subscribers"];

async function runDataImport(startDate, endDate) {
  console.log("running data import:", startDate, endDate);

  for await (let endpoint of endpoints) {
    let endpointURL = baseURL + endpoint;
    endpointURL += `?startDate=${startDate}&endDate=${endDate}`;

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
  .requiredOption('-s, --start-date <startDate>', 'start date')
  .requiredOption('-e, --end-date <endDate>', 'end date')
  .description("hits all data import API endpoints for GA")
  .action( (opts) => {
    runDataImport(opts.startDate, opts.endDate);
  });

program.parse(process.argv);