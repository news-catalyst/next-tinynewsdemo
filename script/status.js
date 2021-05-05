const { program } = require('commander');
program.version('0.0.1');

const shared = require("./shared");
require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

async function listOrganizations() {
  const { errors, data } = await shared.hasuraListOrganizations({
    url: apiUrl,
    adminSecret: adminSecret,
  })

  if (errors) {
    console.error("Error listing organizations:", errors);
  } else {
    data.organizations.map( (org) => {
      console.log(`${org.name} (${org.slug}) created at ${org.created_at} with locales:`)
      org.organization_locales.map( (orgLocale) => {
        console.log(` * ${orgLocale.locale.code}`);
      })
      console.log();
    })
  }
}

program
  .description("checks the status of the current org")
  .action( (opts) => {
    listOrganizations();
  });

program.parse(process.argv);