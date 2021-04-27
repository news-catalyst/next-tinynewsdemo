const fetch = require("node-fetch");
require('dotenv').config({ path: '.env.local' })

const TOKEN = process.env.VERCEL_TOKEN;
const BASE_URL = "https://api.vercel.com/v6";
const ORG_NAME= process.env.ORG_SLUG;
const GIT_REPO = process.env.GIT_REPO;

async function createProject() {

  let projectId;
  let domain;


  let requestHeaders = {
    "Authorization": `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  }

  let teamsUrl = BASE_URL + "/teams";
  let teamsResult = await fetch(teamsUrl, {
    method: "GET",
    headers: requestHeaders,
  })
  let teamsData = await teamsResult.json();
  let ncTeam = teamsData.teams.find((data) => data.slug === 'news-catalyst');

  let teamId = ncTeam.id;
  console.log("news catalyst team id: ", teamId)

  let url = BASE_URL + "/projects?teamId=" + teamId;

  console.log("creating vercel project with name:", ORG_NAME)

  let requestBody = JSON.stringify({
        name: ORG_NAME,
        gitRepository: {
          type: 'github',
          repo: GIT_REPO,
        }
      });
      console.log(requestBody);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: requestBody
    });

    const data = await response.json();
    console.log(" - vercel create project result:", data);

    if (data && data.error) {
      console.error("[" + data.error.code + "] Unable to create Vercel project because: " + data.error.message);
    } else {
      domain = data.alias[0].domain;
      console.log("Created Vercel project for " + ORG_NAME);

      projectId = data.id;

      let projectUrl = BASE_URL + "/projects/" + projectId + "?teamId=" + teamId;
      const updateResponse = await fetch(projectUrl, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify({
          framework: "nextjs",
          buildCommand: "yarn clear && yarn populate && yarn build"

        })
      });
      const updateResponseData = await updateResponse.json();
      if (updateResponseData.error) {
        console.error("Failed configuring the project for nextjs with a custom build command: ", updateResponseData.error);
      }
      let envUrl = projectUrl + "/env?teamId=" + teamId;

      const currentEnv = require('dotenv').config({ path: '.env.local' });
      let envData = currentEnv.parsed;

      const envRequestPromises = Object.keys(envData).map(key => fetch(envUrl, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({
            "type": "encrypted",
            "key": key,
            "value": envData[key],
            "target": [
              "production",
              "preview"
            ]
          })
        })
      );
      
      const envResults = await Promise.all(envRequestPromises);

      console.log();
      console.log("Done! The project is configured and all environment variables from .env.local are setup. To deploy, push to the master branch on github");
    }
  } catch (error) {
    console.log("error creating project in vercel:", error);
  }
}

module.exports = {
  createProject
}