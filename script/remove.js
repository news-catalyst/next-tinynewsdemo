
const { program } = require('commander');
program.version('0.0.1');

const shared = require("./shared");
require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

async function removeOrganization(slug) {
  const { errors, data } = await shared.hasuraRemoveOrganization({
    url: apiUrl,
    adminSecret: adminSecret,
    slug: slug,
  })

  if (errors) {
    console.error("Error deleting organization data: ", errors);

  } else {
    console.log(`Deleted organization data for ${slug}`, data)
  }
}

program
  .requiredOption('-s, --slug <slug>', 'unique slug identifier of the organization')
  .description("removes all data for the specified org")
  .action( (opts) => {
    removeOrganization(opts.slug);
  });

program.parse(process.argv);