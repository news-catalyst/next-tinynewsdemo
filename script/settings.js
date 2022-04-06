const { program } = require('commander');
program.version('0.0.1');

const shared = require('./shared');

// organizations subdomain => .env.local-${orgSlug}
const orgEnvMapping = {
  'austin-vida': 'austin-vida',
  blackbygod: 'black-by-god',
  fivewardsmedia: 'five-wards-media',
  harveyworld: 'harvey-world-herald',
  angdiaryo: 'ang-diaryo',
  spotlightschools: 'spotlight-schools',
};

const universalSettings = {
  HASURA_ADMIN_SECRET:
    'bL3Lo81fjmv4hwaWsV8gOHyywKqTBwOndHy0wh2LfC53HUwqTuvAeysQh6J2IrLb',
  HASURA_API_URL: 'https://heroic-snapper-25.hasura.app/v1/graphql',
  SECRET: 'v5H0xDzf+FIf2Y2/oJab7tSJZCMgLt80QzZX9aEYJNE=',
  NEXT_PUBLIC_SECRET: 'v5H0xDzf+FIf2Y2/oJab7tSJZCMgLt80QzZX9aEYJNE=',
  NEXTAUTH_SECRET: 'v5H0xDzf+FIf2Y2/oJab7tSJZCMgLt80QzZX9aEYJNE=',
  GOOGLE_CLIENT_ID:
    '1027657873629-ks6qtf9qjbd73ic28488mvketcflfmh5.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: 'tnSAyS8vHLURKoaT0HpQlZD0',
  AUTHORIZED_EMAIL_DOMAINS:
    'tinynewsco.org,newscatalyst.org,blackbygod.org,austin-vida.com,spotlightschools.com,fivewardsmedia.com,harveyworld.org',
  LOCALES: 'en-US',
  AIRBRAKE_PROJECT_ID: '370377',
  AIRBRAKE_PROJECT_KEY: 'c65ad6a0c716d03ae88bc64e96fbdf77',
  TNC_AWS_BUCKET_NAME: 'tnc-staging-bucket',
};

async function insertSettings(site) {
  let orgSlug = orgEnvMapping[site];
  if (!orgSlug) {
    throw `No environment file found for ${site}`;
  }

  let orgEnvFilename = `.env.local-${orgSlug}`;

  const envSettings = require('dotenv').config({ path: orgEnvFilename });
  if (envSettings.error) {
    throw envSettings.error;
  }

  let settingsObjects = [];
  for (const label in envSettings.parsed) {
    const uniSetting = universalSettings[label];
    if (label === 'NEXT_PUBLIC_SITE_URL') {
      let siteUrl = `https://${site}.tinynewsco.dev`;
      console.log(`~ Setting site url to ${siteUrl}`);
      settingsObjects.push({
        name: label,
        value: siteUrl,
      });
    } else if (!uniSetting) {
      console.log(`* Using custom setting for ${label}`); //, envSettings.parsed[label]);
      settingsObjects.push({
        name: label,
        value: envSettings.parsed[label],
      });
    } else {
      console.log(`- Using universal setting for ${label}`);
      settingsObjects.push({
        name: label,
        value: uniSetting,
      });
    }
  }
  console.log(settingsObjects);
  const { errors, data } = await shared.hasuraInsertSettings({
    url: universalSettings['HASURA_API_URL'],
    site: site,
    settings: settingsObjects,
  });

  if (errors) {
    console.error('Error populating settings:', errors);
  } else {
    console.log(`Populated settings table for ${site}:`);
    console.log(JSON.stringify(data));
  }
}

program
  .description('populates the settings table for each TNC org')
  .requiredOption('-s, --site <site>', 'the site param for the tiny news org')
  .action((opts) => {
    insertSettings(opts.site);
  });

program.parse(process.argv);
