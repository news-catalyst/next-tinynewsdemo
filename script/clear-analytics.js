const { program } = require('commander');
program.version('0.0.1');

const shared = require("./shared");
require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const orgSlug = process.env.ORG_SLUG;

async function deleteAnalytics(slug) {
  const { errors, data } = await shared.hasuraDeleteAnalytics({
    url: apiUrl,
    orgSlug: orgSlug,
    slug: slug,
  })

  if (errors) {
    console.error(`Error deleting analytics data for organization '${orgSlug}': `, errors);

  } else {
    console.log(`Deleted analytics data for organization '${orgSlug}'`, data)
  }
}

program
  // .requiredOption('-s, --slug <slug>', 'unique slug identifier of the organization')
  .description("removes all data for the current (.env.local defined) org")
  .action( (opts) => {
    deleteAnalytics();
  });

program.parse(process.argv);