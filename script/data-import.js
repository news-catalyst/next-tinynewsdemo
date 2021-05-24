const core = require('@actions/core');

const fetch = require("node-fetch");
require('dotenv').config({ path: '.env.local' })

const {format} = require('date-fns');

const baseURL = process.env.SITE_URL + "/api/import/";

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
      const error = new Error("Failed importing data");
      error.code = 500;
      error.message = JSON.stringify(resultData);
      console.error("Failed importing data:", error);
      throw error
    }
    let message = JSON.parse(resultData)
    return message;
  })
  .catch(err => {
    return err
  })
}

(async () => {
  let endpoint = process.argv[2];

  let yesterday = new Date(); 
  let startDate = new Date(yesterday.setDate(yesterday.getDate() - 1));
  if (process.argv[3]) { 
    startDate = new Date(process.argv[3])
  }

  let today = new Date(); 
  let endDate = new Date(today.setDate(today.getDate() - 1));
  if (process.argv[4]) { 
    endDate = new Date(process.argv[4])
  }

  let result;
  try {
    result = await runDataImport(startDate, endDate, endpoint);
  } catch(err) {
    console.error("caught error:", err);
    core.setFailed(`Action failed with error ${err}`);
  }
})();