const core = require('@actions/core');

const fetch = require("node-fetch");
require('dotenv').config({ path: '.env.local' })

const {format} = require('date-fns');

const baseURL = process.env.NEXT_PUBLIC_SITE_URL + "/api/import/";

async function runDataImport(startDate, endDate, table) {
  console.log("running data import:", startDate, endDate, table);

  let endpointURL = baseURL + table;
  endpointURL += `?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`;

  fetch(endpointURL, {
    method: "GET",
  })
  .then(res => {
    console.log("converting res to json", res)
    return res.json()
  })
  .then(resultData => {
    console.log("got resultData:", resultData)
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
    console.log("error from data import api:", err)
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