const fetch = require("node-fetch");
require('dotenv').config({ path: '.env.local' })

const TOKEN = process.env.VERCEL_TOKEN;
const BASE_URL = "https://api.vercel.com/v6";
const GIT_REPO = process.env.GIT_REPO;

async function getProjects() {
  let requestHeaders = {
    "Authorization": `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  }

  let teamsUrl = "https://api.vercel.com/v1/teams";
  let teamsResult = await fetch(teamsUrl, {
    method: "GET",
    headers: requestHeaders,
  })
  let teamsData = await teamsResult.json();
  let ncTeam = teamsData.teams.find((data) => data.slug === 'news-catalyst');

  let teamId = ncTeam.id;
  console.log("news catalyst team id: ", teamId)

  let url = "https://api.vercel.com/v4/projects/?teamId=" + teamId;
  let result = await fetch(url, {
    method: "GET",
    headers: requestHeaders,
  })
  let projectsData = await result.json();
  projectsData.projects.map((project) => console.log(project));
}

async function createProject(name, slug) {

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

  console.log("Creating Vercel project with name:", name)

  let requestBody = JSON.stringify({
    name: slug,
    gitRepository: {
      type: 'github',
      repo: GIT_REPO,
    }
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: requestBody
    });

    const data = await response.json();

    if (data && data.error) {
      console.error("[" + data.error.code + "] Unable to create Vercel project '" + slug + "' because: " + data.error.message);
    } else {
      domain = data.alias[0].domain;
      console.log("Created Vercel project for " + name + " with name " + slug);

      projectId = data.id;

      let projectUrl = BASE_URL + "/projects/" + projectId + "/?teamId=" + teamId;
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
        console.error("Failed configuring the project for nextjs with a custom build command: ", updateResponseData.error, projectUrl);
      }

      let envUrl = "https://api.vercel.com/v7/projects/" + projectId + "/env/?teamId=" + teamId;
      let envFilename = `.env.local-${slug}`
      const currentEnv = require('dotenv').config({ path: envFilename });
      let envData = currentEnv.parsed;

      let results = [];
      let envSuccess = true;
      for(const key of Object.keys(envData)) {
        const result = await fetch(envUrl, {
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
        });
        if (!result.ok) {
          envSuccess = false;
          result.json().then((data) => console.log(" - failed creating env var:", key, data));
        } else {
          console.log(" - configured env var:", key)
        }
        results.push(result);
      }
      // next set the VERCEL_ENV for preview and production
      const productionEnvResult = await fetch(envUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          "type": "encrypted",
          "key": "VERCEL_ENV",
          "value": "production",
          "target": [
            "production",
          ]
        })
      });
      results.push(productionEnvResult);
      const previewEnvResult = await fetch(envUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          "type": "encrypted",
          "key": "VERCEL_ENV",
          "value": "preview",
          "target": [
            "preview",
          ]
        })
      });
      results.push(previewEnvResult);

      console.log();
      console.log("✅ Done! The project is created in Vercel. To deploy, push to the master branch on github");
      if (envSuccess) {
        console.log("✅ All env vars are configured in Vercel from .env.local btw");
      } else {
        console.error("🤬 Unfortunately we ran into a problem configuring the env vars, though. Either try this again or set them yourself in the web admin.")
      }
    }
  } catch (error) {
    console.log("error creating project in vercel:", error);
  }
}

module.exports = {
  createProject,
  getProjects
}