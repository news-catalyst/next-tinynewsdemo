
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

async function removeOrganization(slug) {
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
  .description("removes all data for the specified org")
  .action( (opts) => {
    removeOrganization(opts.slug);
  });

program.parse(process.argv);