const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const TOKEN = process.env.VERCEL_TOKEN;
const BASE_URL = 'https://api.vercel.com/v1';
const GIT_REPO = process.env.GIT_REPO;

async function getProjects() {
  let requestHeaders = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  let teamsUrl = 'https://api.vercel.com/v1/teams';
  let teamsResult = await fetch(teamsUrl, {
    method: 'GET',
    headers: requestHeaders,
  });
  let teamsData = await teamsResult.json();
  console.error(
    `Looking up projects in Vercel failed: can't find the News Catalyst team at ${teamsUrl}:`,
    teamsData
  );
  let ncTeam = teamsData.teams.find((data) => data.slug === 'news-catalyst');

  let teamId = ncTeam.id;
  // console.log("news catalyst team id: ", teamId)

  let url = 'https://api.vercel.com/v4/projects/?teamId=' + teamId;
  let result = await fetch(url, {
    method: 'GET',
    headers: requestHeaders,
  });
  let projectsData = await result.json();
  projectsData.projects.map((project) => console.log(project));
}

async function createProject(name, slug) {
  let projectId;
  let domain;

  let requestHeaders = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  let teamsUrl = BASE_URL + '/teams';
  let teamsResult = await fetch(teamsUrl, {
    method: 'GET',
    headers: requestHeaders,
  });
  let teamsData = await teamsResult.json();
  if (!teamsData || !teamsData.teams) {
    console.error(
      `Vercel setup failed: can't find the News Catalyst team at ${teamsUrl}:`,
      teamsData
    );

    return;
  }

  let ncTeam = teamsData.teams.find((data) => data.slug === 'news-catalyst');

  let teamId = ncTeam.id;
  // console.log("news catalyst team id: ", teamId)

  let url = BASE_URL + '/projects?teamId=' + teamId;

  console.log('[vercel] Creating project with name:', name);

  let requestBody = JSON.stringify({
    name: slug,
    gitRepository: {
      type: 'github',
      repo: GIT_REPO,
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: requestBody,
    });

    const data = await response.json();

    if (data && data.error) {
      console.error(
        '[vercel] ' +
          data.error.code +
          " Unable to create project '" +
          slug +
          "' because: " +
          data.error.message
      );
    } else {
      domain = data.alias[0].domain;
      console.log(
        '[vercel] Created project for ' + name + ' with name ' + slug
      );

      projectId = data.id;

      let projectUrl =
        BASE_URL + '/projects/' + projectId + '/?teamId=' + teamId;
      const updateResponse = await fetch(projectUrl, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify({
          framework: 'nextjs',
          buildCommand: 'yarn clear && yarn populate && yarn build',
        }),
      });
      const updateResponseData = await updateResponse.json();
      if (updateResponseData.error) {
        console.error(
          'Failed configuring the project for nextjs with a custom build command: ',
          updateResponseData.error,
          projectUrl
        );
      }

      let envUrl =
        'https://api.vercel.com/v7/projects/' +
        projectId +
        '/env/?teamId=' +
        teamId;
      let envFilename = `.env.local-${slug}`;
      const currentEnv = require('dotenv').config({ path: envFilename });
      let envData = currentEnv.parsed;

      // console.log(envData);
      let results = [];
      let envSuccess = true;
      for (const key of Object.keys(envData)) {
        const result = await fetch(envUrl, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({
            type: 'encrypted',
            key: key,
            value: envData[key],
            target: ['production', 'preview'],
          }),
        });
        if (!result.ok) {
          envSuccess = false;
          result
            .json()
            .then((data) =>
              console.log(' - [vercel] failed creating env var:', key, data)
            );
        } else {
          console.log(' - [vercel] configured env var:', key);
        }
        results.push(result);
      }
      // next set the VERCEL_ENV for preview and production
      const productionEnvResult = await fetch(envUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          type: 'encrypted',
          key: 'VERCEL_ENV',
          value: 'production',
          target: ['production'],
        }),
      });
      results.push(productionEnvResult);
      const previewEnvResult = await fetch(envUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          type: 'encrypted',
          key: 'VERCEL_ENV',
          value: 'preview',
          target: ['preview'],
        }),
      });
      results.push(previewEnvResult);

      console.log();
      console.log(
        '[vercel] ✅ Done! The project is created. To deploy, push to the master branch on github'
      );
      if (envSuccess) {
        console.log(
          '[vercel] ✅ All env vars are configured from .env.local btw'
        );
      } else {
        console.error(
          '[vercel] 🤬 Unfortunately we ran into a problem configuring the env vars, though. Either try this again or set them yourself in the web admin.'
        );
      }
    }
  } catch (error) {
    console.log('[vercel] error creating project:', error);
  }
}

async function deleteProject(name) {
  let requestHeaders = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  let teamsUrl = BASE_URL + '/teams';
  let teamsResult = await fetch(teamsUrl, {
    method: 'GET',
    headers: requestHeaders,
  });
  let teamsData = await teamsResult.json();
  if (!teamsData || !teamsData.teams) {
    console.error(
      `Removing project from Vercel failed: can't find the News Catalyst team at ${teamsUrl}:`,
      teamsData
    );
    return;
  }
  let ncTeam = teamsData.teams.find((data) => data.slug === 'news-catalyst');

  let teamId = ncTeam.id;
  // console.log("news catalyst team id: ", teamId)

  let removeProjectUrl = BASE_URL + '/projects/' + name + '?teamId=' + teamId;
  // let  = `https://api.vercel.com/v8/projects/${name}`;
  let result = await fetch(removeProjectUrl, {
    method: 'DELETE',
    headers: requestHeaders,
  });
  if (result.ok) {
    return `Successfully deleted the project named '${name}' from Vercel`;
  } else {
    return `An error occurred trying to remove the project named ${name} from Vercel: ${JSON.stringify(
      result
    )}`;
  }
}

module.exports = {
  createProject,
  getProjects,
  deleteProject,
};
