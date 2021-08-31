
const { program } = require('commander');
program.version('0.0.1');

const vercel = require("./vercel");
const shared = require("./shared");

const { Octokit } = require("@octokit/rest"); 

require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

const githubRepo = process.env.GIT_REPO;
const githubToken = process.env.GITHUB_TOKEN;


const { google } = require("googleapis");
const credentials = require("./credentials.json");
const scopes = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/analytics", "https://www.googleapis.com/auth/analytics.edit"];
const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);
const analytics = google.analytics({version: "v3", auth})
const googleAnalyticsAccountID = process.env.GA_ACCOUNT_ID;

async function removeOrganization(slug, name) {
  const octokit = new Octokit({
    auth: githubToken,
  });
  const [owner, repo] = githubRepo.split('/');

  const removeResult = await vercel.deleteProject(slug);
  console.log(removeResult);

  let githubEnvironment = `data_import_${slug}`
  try {
    const githubResponse = await octokit.rest.repos.deleteAnEnvironment({
      "owner": owner,
      "repo": repo,
      "environment_name": githubEnvironment,
    });
    if (githubResponse && githubResponse["status"] === 204) {
      console.log(`Deleted ${githubEnvironment} environment from GitHub.`);
    }
  } catch(e) {
    console.error(e);
  }

  let statusResponse = await analytics.management.webproperties.list({'accountId': googleAnalyticsAccountID});
  if (statusResponse.data.items && statusResponse.data.items.length) {
    let items = statusResponse.data.items;
    for await (let item of items) {
      // console.log(`[GA] * ${item.id}: ${item.name} (${item.profileCount} profiles)` )
      
      if (name === item.name) {
        console.log( "[GA] *** Listing profile IDs in property " + item.id + " ***")
        let response = await analytics.management.profiles.list({
            accountId: googleAnalyticsAccountID,
            webPropertyId: item.id
        })
        if (response && response.data && response.data.items && response.data.items[0]) {
          let profileId = response.data.items[0].id;

          let deleteGA = await analytics.management.profiles.delete(
            {
              accountId: googleAnalyticsAccountID,
              webPropertyId: item.id,
              profileId: profileId
          });
        
          if (deleteGA && deleteGA.statusText === "OK") {
            console.log("*** [GA] Deleted profile from Google Analytics:", item.id, profileId);
          } else {
            console.error(`!!! [GA] Error deleting profile from Google Analytics using webPropertyId:${item.id} and profileId:${profileId}:`, deleteGA);
          }
        } else {
          console.log("*** [GA] skipping - no profiles found for property: " + item.id)
        }

      }
    }
  }

  const { errors, data } = await shared.hasuraRemoveOrganization({
    url: apiUrl,
    adminSecret: adminSecret,
    slug: slug,
  })

  if (errors) {
    console.error("Error deleting organization data: ", errors);

  } else {
    console.log(`Deleted organization data for ${slug}`, data);
  }
}

program
  .requiredOption('-s, --slug <slug>', 'unique slug identifier of the organization')
  .requiredOption('-n, --name <name>', 'name of the organization as found in Google Analytics')
  .description("removes all data for the specified org")
  .action( (opts) => {
    removeOrganization(opts.slug, opts.name);
  });

program.parse(process.argv);