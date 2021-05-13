const fetch = require("node-fetch");
require('dotenv').config({ path: '.env.local' })

const {format} = require('date-fns');

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

let twoDaysAgo = new Date(); 
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); 
let startDate = format(twoDaysAgo, "yyyy-MM-dd")

let yesterday = new Date(); // Today!
yesterday.setDate(yesterday.getDate() - 1); 
let endDate = format(yesterday, "yyyy-MM-dd")

runDataImport(startDate, endDate);