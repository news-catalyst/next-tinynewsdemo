#! /usr/bin/env node

const { program } = require('commander');
program.version('0.0.1');

const fs = require('fs');
const yaml = require('js-yaml');

const { google } = require('googleapis');
const credentials = require('./credentials.json');
const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/analytics',
  'https://www.googleapis.com/auth/analytics.edit',
];
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);
const analytics = google.analytics({ version: 'v3', auth });

const { Octokit } = require('@octokit/rest'); // lists GH envs
const { request } = require('@octokit/request'); // for creating GH env
const sodium = require('tweetsodium'); // for encrypting GH env secrets

const shared = require('./shared');
const vercel = require('./vercel');

require('dotenv').config({ path: '.env.local' });

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

const githubRepo = process.env.GIT_REPO;
const githubToken = process.env.GITHUB_TOKEN;

const googleAnalyticsAccountID = process.env.GA_ACCOUNT_ID;

let organizationID;

// encrypts a secret for GH environment variable setting
function encryptSecret(key, value) {
  // console.log('encrypting', key, value);
  // Convert the message and key to Uint8Array's (Buffer implements that interface)
  const messageBytes = Buffer.from(value);
  const keyBytes = Buffer.from(key, 'base64');

  // Encrypt using LibSodium.
  const encryptedBytes = sodium.seal(messageBytes, keyBytes);

  // Base64 the encrypted secret
  const encrypted = Buffer.from(encryptedBytes).toString('base64');

  return encrypted;
}

// really simple function but this prevents us from using two different environment names in the code
function generateEnvName(slug) {
  return `data_import_${slug}`;
}

// create the environment on github and supply it with the required env vars for doing GA data import action runs
async function createGitHubEnv(slug) {
  const environmentName = generateEnvName(slug);
  console.log('🏞  Creating GitHub environment called', environmentName);

  const currentEnv = require('dotenv').config({ path: '.env.local' });

  if (currentEnv.error) {
    throw currentEnv.error;
  }

  let envExists = false;

  const octokit = new Octokit({
    auth: githubToken,
  });

  const [owner, repo] = githubRepo.split('/');

  let repoID;

  try {
    const repoResult = await octokit.rest.repos.get({
      owner,
      repo,
    });
    repoID = repoResult.data.id;
    console.log('🧐 Looking up repository ID.... found it: ' + repoID);
  } catch (e) {
    console.error(e);
  }

  try {
    const response = await octokit.rest.repos.getAllEnvironments({
      owner,
      repo,
    });
    console.log('📊 Current data import environments:');
    response.data.environments.forEach((env) => {
      if (/data_import_/.test(env.name)) {
        console.log(`\t* ${env.name}`);
      }
      if (env.name === environmentName) {
        envExists = true;
      }
    });

    if (envExists) {
      console.error(
        '️✋ GitHub environment called ' +
          environmentName +
          ' already exists... configuring secrets now.'
      );
    } else {
      // the `createOrUpdateEnvironment` method version of this request in Octokit/rest doesn't work.
      // it's using the wrong GH api url and format.
      // (does a PUT to /repos/owner/repo/environments with {environment_name: $name} in the request body)
      // this is the correct request URL and format.
      // https://docs.github.com/en/rest/reference/repos#create-or-update-an-environment
      const result = await request(
        'PUT /repos/{owner}/{repo}/environments/{environment_name}',
        {
          headers: {
            authorization: `token ${githubToken}`,
          },
          owner: owner,
          repo: repo,
          environment_name: environmentName,
        }
      );

      if (result && result.status >= 200 && result.status < 300) {
        console.log(
          '👍 Created new GitHub environment called ' + environmentName
        );
        envExists = true;
      }
    }
  } catch (err) {
    console.error(err);
  }

  try {
    console.log('🤫 Okay, now configuring the environment with secrets...');

    const secrets = [
      'GOOGLE_CREDENTIALS_EMAIL',
      'GOOGLE_CREDENTIALS_PRIVATE_KEY',
      'HASURA_API_URL',
      'NEXT_PUBLIC_ANALYTICS_VIEW_ID',
      'ORG_SLUG',
      'NEXT_PUBLIC_SITE_URL',
      'LETTERHEAD_API_URL',
      'LETTERHEAD_API_KEY',
      'LETTERHEAD_CHANNEL_SLUG',
      'AUTHORIZED_EMAIL_DOMAINS',
      'VERCEL_DEPLOY_HOOK',
    ];

    const pubKeyResult = await octokit.rest.actions.getRepoPublicKey({
      owner,
      repo,
    });
    const pubKey = pubKeyResult.data.key;
    const pubKeyID = pubKeyResult.data.key_id;

    for await (let secretName of secrets) {
      let plainValue = currentEnv.parsed[secretName];

      let encryptedValue = encryptSecret(pubKey, plainValue);
      console.log(
        `\t* setting secret ${secretName} - plain value = '${plainValue}' encrypted as '${encryptedValue}'`
      );

      const secretResult = await octokit.rest.actions.createOrUpdateEnvironmentSecret(
        {
          repository_id: repoID,
          environment_name: environmentName,
          secret_name: secretName,
          encrypted_value: encryptedValue,
          key_id: pubKeyID,
        }
      );
      if (
        secretResult &&
        secretResult.status >= 200 &&
        secretResult.status < 300
      ) {
        console.log(`\t* done creating secret: ${secretName}`);
      } else {
        console.error(
          `\t* error creating secret ${secretName}: ${JSON.stringify(
            secretResult
          )}`
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function setupGitHubAction(slug) {
  let source = '.github/workflows/import-data-from-ga.yml';
  let destination = `.github/workflows/import-data-from-ga-${slug}.yml`;

  try {
    let sourceContents = fs.readFileSync(source, 'utf8');
    let sourceData = yaml.load(sourceContents);

    const environmentName = generateEnvName(slug);
    sourceData['jobs']['GA-Data-Importer']['environment'] = environmentName;

    let yamlStr = yaml.dump(sourceData);
    fs.writeFileSync(destination, yamlStr, 'utf8');

    console.log(
      'setup a new github action at ' +
        destination +
        ' in env ' +
        environmentName
    );
  } catch (e) {
    console.error(e);
  }
}

async function setupGoogleAnalytics(name, url) {
  let response = await analytics.management.webproperties.insert({
    accountId: googleAnalyticsAccountID,
    resource: {
      websiteUrl: url,
      name: name,
    },
  });
  let propertyId = response.data.id;
  console.log(
    `[GA] Created property with ID ${propertyId} for ${response.data.name} on domain ${response.data.websiteUrl}`
  );

  // create the view (aka profile)
  let profileResponse = await analytics.management.profiles.insert({
    accountId: googleAnalyticsAccountID,
    webPropertyId: propertyId,
    resource: {
      name: `${name} website`,
      botFilteringEnabled: true,
    },
  });

  console.log(`[GA] Created view with ID ${profileResponse.data.id}`);
  console.log(`[GA] Current status of accounts:`);
  let statusResponse = await analytics.management.webproperties.list({
    accountId: googleAnalyticsAccountID,
  });
  if (statusResponse.data.items && statusResponse.data.items.length) {
    statusResponse.data.items.map((item) => {
      console.log(
        `[GA] * ${item.id}: ${item.name} (${item.profileCount} profiles)`
      );
    });
  } else {
    console.error(
      'No properties found in GA Account:',
      googleAnalyticsAccountID
    );
  }
  return propertyId;
}

// sets up org-specific ENV values
async function configureNext(name, slug, locales, url, gaTrackingId) {
  const currentEnv = require('dotenv').config({ path: '.env.local' });

  if (currentEnv.error) {
    throw currentEnv.error;
  }

  const parsedUrl = new URL(url);
  let hostName = parsedUrl.hostname;
  let domain;
  if (hostName.match(/^www/)) {
    // should we try matching any other subdomain here?
    domain = hostName.replace(/^[^.]+\./g, '');
  } else {
    domain = hostName;
  }
  currentEnv.parsed['AUTHORIZED_EMAIL_DOMAINS'] = domain;
  currentEnv.parsed['NEXT_PUBLIC_SITE_URL'] = url;
  // set these to the new organization values
  currentEnv.parsed['ORG_NAME'] = name;
  currentEnv.parsed['ORG_SLUG'] = slug;
  currentEnv.parsed['TNC_AWS_DIR_NAME'] = slug;
  currentEnv.parsed['NEXT_PUBLIC_GA_TRACKING_ID'] = gaTrackingId;
  currentEnv.parsed['LOCALES'] = arrayUnique(locales).join(',');

  console.log('Creating new environment file using the following settings:');
  console.log(currentEnv.parsed);

  let orgEnvFilename = `.env.local-${slug}`;
  let tempEnvFilename = '.new.env.local';

  var tempFile = fs.createWriteStream(tempEnvFilename, { flags: 'a' });

  tempFile.on('open', function (fd) {
    Object.keys(currentEnv.parsed).map((key) => {
      tempFile.write(`${key}=${currentEnv.parsed[key]}` + '\n');
    });
    tempFile.end();
    if (fs.existsSync(tempEnvFilename)) {
      fs.renameSync(tempEnvFilename, orgEnvFilename);
      console.log('Created new environment file: ', orgEnvFilename);
    } else {
      console.error('Temporary env file does not exist:', tempEnvFilename);
    }
  });
}

async function createOrganization(opts) {
  let name = opts.name;
  let slug = opts.slug;
  let locales = opts.locales[0].split(',');
  let url = opts.url;

  // console.log('locales:', typeof locales, locales);

  let gaTrackingId = await setupGoogleAnalytics(name, url);
  console.log('GA Tracking ID: ', gaTrackingId);

  await configureNext(name, slug, locales, url, gaTrackingId);

  const { errors, data } = await shared.hasuraInsertOrganization({
    url: apiUrl,
    adminSecret: adminSecret,
    name: name,
    slug: slug,
  });

  if (errors) {
    console.error(
      "Error creating a record for organization with name '" + name + "':",
      errors
    );
  } else {
    organizationID = data.insert_organizations_one.id;
    console.log(
      'Created a record for organization with ID ' + organizationID,
      data
    );

    shared
      .hasuraListAllLocales({
        url: apiUrl,
        adminSecret: adminSecret,
      })
      .then((res) => {
        let allLocales = res.data.locales;
        let orgLocaleObjects = [];
        allLocales.forEach((aLocale) => {
          let foundLocale = locales.find((l) => l === aLocale.code);
          if (!foundLocale) {
            // console.log(`${aLocale.code} skip`);
            return;
          }

          orgLocaleObjects.push({
            locale_id: aLocale.id,
            organization_id: organizationID,
          });

          shared
            .hasuraInsertSections({
              url: apiUrl,
              adminSecret: adminSecret,
              objects: [
                {
                  organization_id: organizationID,
                  title: 'News',
                  slug: 'news',
                  published: true,
                  category_translations: {
                    data: {
                      locale_code: aLocale.code,
                      title: 'News',
                    },
                    on_conflict: {
                      constraint:
                        'category_translations_locale_code_category_id_key',
                      update_columns: 'title',
                    },
                  },
                },
                {
                  organization_id: organizationID,
                  title: 'Politics',
                  slug: 'politics',
                  published: false,
                  category_translations: {
                    data: {
                      locale_code: aLocale.code,
                      title: 'Politics',
                    },
                    on_conflict: {
                      constraint:
                        'category_translations_locale_code_category_id_key',
                      update_columns: 'title',
                    },
                  },
                },
                {
                  organization_id: organizationID,
                  title: 'COVID-19',
                  slug: 'covid-19',
                  published: false,
                  category_translations: {
                    data: {
                      locale_code: aLocale.code,
                      title: 'COVID-19',
                    },
                    on_conflict: {
                      constraint:
                        'category_translations_locale_code_category_id_key',
                      update_columns: 'title',
                    },
                  },
                },
              ],
            })
            .then((res) => {
              console.log(
                `[${aLocale.code}] created the default sections:`,
                res
              );
              shared
                .hasuraUpsertHomepageLayout({
                  url: apiUrl,
                  adminSecret: adminSecret,
                  organization_id: organizationID,
                  name: 'Large Package Story Lead',
                  data:
                    '{ "subfeatured-top":"string", "subfeatured-bottom":"string", "featured":"string" }',
                })
                .then((res) => {
                  console.log(
                    `[${aLocale.code}] created the Large Package Story Lead homepage layout:`,
                    res
                  );
                  shared
                    .hasuraUpsertHomepageLayout({
                      url: apiUrl,
                      adminSecret: adminSecret,
                      organization_id: organizationID,
                      name: 'Big Featured Story',
                      data: '{ "featured":"string" }',
                    })
                    .then((res) => {
                      console.log(
                        `[${aLocale.code}] created the Big Featured Story homepage layout:`,
                        res
                      );
                    });
                });
            });
        });
        shared
          .hasuraInsertOrgLocales({
            url: apiUrl,
            adminSecret: adminSecret,
            orgLocales: orgLocaleObjects,
          })
          .then((res) => {
            console.log('Setup locales for the organization:', res);

            let siteMetadata = {
              color: 'colorone',
              theme: 'styleone',
              siteUrl: url,
              aboutCTA: 'Learn more',
              aboutDek: `About the ${name} TK`,
              aboutHed: 'Who We Are',
              bodyFont: 'Domine',
              shortName: name,
              supportCTA: 'Donate',
              supportDek: `${name} exists based on the support of our readers. Chip in today to help us continue delivering quality journalism.`,
              supportHed: 'Support our work',
              supportURL:
                'https://tiny-news-collective.monkeypod.io/give/support-the-oaklyn-observer?secret=84fc2987ea6e8f11b8f4f8aca8b749d7',
              footerTitle: url,
              headingFont: 'Libre Franklin',
              searchTitle: name,
              primaryColor: '#de7a00',
              twitterTitle: 'Twitter title',
              facebookTitle: 'Facebook title',
              homepageTitle: name,
              membershipDek:
                'Support great journalism by becoming a member for a low monthly price.',
              membershipHed: 'Become a member',
              newsletterDek: `Get the latest headlines from ${name} right in your inbox.`,
              newsletterHed: 'Sign up for our newsletter',
              donateBlockDek:
                'Support our local journalism with a monthly pledge.',
              donateBlockHed: 'Donate',
              secondaryColor: '#002c57',
              donationOptions:
                '[{\n"amount": 5,\n"name": "Member",\n"description": "This is a description.",\n"cta": "Donate"\n},\n{\n"amount": 10,\n"name": "Supporter",\n"description": "This is a description.",\n"cta": "Donate"\n},\n{\n"amount": 20,\n"name": "Superuser",\n"description": "This is a description.",\n"cta": "Donate"\n}]',
              footerBylineLink: url,
              footerBylineName: name,
              searchDescription: 'Page description',
              twitterDescription: 'Twitter description',
              facebookDescription: 'Facebook description',
              commenting: 'on',
              advertisingHed: `Advertise with ${name}`,
              advertisingDek:
                'Want to reach our engaged, connected audience? Advertise within our weekly newsletter!',
              advertisingCTA: 'Buy an advertisement',
            };

            locales.map((locale) => {
              shared
                .hasuraUpsertMetadata({
                  url: apiUrl,
                  adminSecret: adminSecret,
                  organization_id: organizationID,
                  data: siteMetadata,
                  locale_code: locale,
                  published: true,
                })
                .then((res) => {
                  if (res.errors) {
                    console.error(
                      `[${locale}] ! Failed creating site metadata`
                    );
                    console.error(res.errors);
                  } else {
                    console.log(`[${locale}] created site metadata`);
                    // console.log(JSON.stringify(res));
                  }
                });
            });

            setupGitHubAction(slug);
            createGitHubEnv(slug);

            console.log(
              'Make sure to review settings in the tinycms once this is done!'
            );
          });
      })
      .catch(console.error);
  }
}

function arrayUnique(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
}

program
  .requiredOption('-n, --name <name>', 'the name of the new organization')
  .requiredOption(
    '-s, --slug <slug>',
    'a short (A-Za-z0-9_) slug for the organization'
  )
  .requiredOption('-l, --locales [locales...]', 'specify supported locales')
  .requiredOption(
    '-u, --url <url>',
    'specify the url on vercel, used for GA property setup'
  )
  .description('sets up a new organization in Hasura and Google Drive')
  .action((opts) => {
    (async () => {
      console.log('Creating organization in the database and env... ');
      await createOrganization(opts);
      console.log('Done. Setting up project in Vercel... ');
      await vercel.createProject(opts.name, opts.slug);
      console.log('All done!');
    })();
  });

program.parse(process.argv);
