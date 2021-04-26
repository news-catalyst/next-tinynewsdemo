const fetch = require("node-fetch");
require('dotenv').config({ path: '.env.local' })

const TOKEN = process.env.VERCEL_TOKEN;
const BASE_URL = "https://api.vercel.com/v6";
const ORG_NAME= process.env.ORG_SLUG;

async function createProject() {

  let projectId;

  let url = BASE_URL + "/projects";

  let requestHeaders = {
    "Authorization": `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  }

  console.log("creating vercel project with name:", ORG_NAME)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        name: ORG_NAME
      }),
    });

    const data = await response.json();
    console.log(" - vercel create project result:", data);

    if (data && data.error) {
      console.error("[" + data.error.code + "] Unable to create Vercel project because: " + data.error.message);
    } else {
      console.log("Created Vercel project at domain: " + data.alias[0].domain);

      projectId = data.id;
      let envUrl = BASE_URL + "/projects/" + projectId + "/env";

      const currentEnv = require('dotenv').config({ path: '.env.local' });
      let envData = currentEnv.parsed;

      Object.keys(envData).map((key) => {
        let requestData = {
          "type": "encrypted",
          "key": key,
          "value": envData[key],
          "target": [
            "production",
            "preview"
          ]
        };
        fetch(envUrl, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(requestData),
        })
        .then((res) => {
          console.log("- set env var " + key);
        })
        .catch(console.error);
      })
    }
  } catch (error) {
    console.log("error creating project in vercel:", error);
  }
}

module.exports = {
  createProject
}