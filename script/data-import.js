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

async function runDataImport(startDate, endDate, table) {
  console.log("running data import:", startDate, endDate, table);

  let endpointURL = baseURL + table;
  endpointURL += `?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`;

  fetch(endpointURL, {
    method: "GET",
  })
  .then(res => res.json())
  .then(resultData => {
    if (resultData.status === 'error' || resultData.errors) {
      console.error("result error:", resultData.errors);
      throw resultData.errors;
    }
    let message = JSON.parse(resultData)
    return message;
  })
  .catch(err => {
    let errorMessage = `error: ${endpointURL} ${JSON.stringify(err)}`;
    // console.error(errorMessage)
    return errorMessage;
  })
}

program
  .option('-s, --start-date <startDate>', 'start of the date range')
  .option('-e, --end-date <endDate>', 'end of the date range')
  .requiredOption('-t, --table <table>', 'import a single table only')
  .description("imports daily GA data for each date in the specified range")
  .action( (opts) => {
    try {
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

      let endpoint = opts.table;
      console.log("endpoint:", endpoint);

      let output = runDataImport(startDate, endDate, endpoint);
      console.log(output)
    } catch(error) {
      console.log("returning error!@!!!!")
      core.setFailed(error.message);
    }
  });

program.parse(process.argv);