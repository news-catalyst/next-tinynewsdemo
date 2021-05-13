#! /usr/bin/env node

const { program } = require('commander');
program.version('0.0.1');

const fs = require('fs');
const yaml = require('js-yaml')

const { google } = require("googleapis");
const credentials = require("./credentials.json");
const scopes = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/analytics", "https://www.googleapis.com/auth/analytics.edit"];
const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);
const drive = google.drive({ version: "v3", auth });
const analytics = google.analytics({version: "v3", auth})

const { Octokit } = require("@octokit/rest");
const { request } = require("@octokit/request");

const shared = require("./shared");
const vercel = require("./vercel");

require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

const githubRepo = process.env.GIT_REPO;
const githubToken = process.env.GITHUB_TOKEN;

const googleAnalyticsAccountID = process.env.GA_ACCOUNT_ID;

let organizationID;

function generateEnvName(slug) {
  return `data_import_${slug}`
}

async function createGitHubEnv(slug) {
  const octokit = new Octokit({
    auth: githubToken,
  });

  const [owner, repo] = githubRepo.split('/');

  const environmentName = generateEnvName(slug);
  console.log("creating environment", environmentName)

  try {
    const response = await octokit.rest.repos.getAllEnvironments({
      owner,
      repo,
    })
    console.log("Current data import environments:")
    let envExists = false;
    response.data.environments.forEach((env) => {
      if (/data_import_/.test(env.name)) {
        console.log(`\t* ${env.name}`);
      }
      if (env.name === environmentName) {
        envExists = true;
      }
    })

    if (envExists) {
      console.error("environment " + environmentName + " already exists");
      return;
    }

    // the `createOrUpdateEnvironment` method version of this request in Octokit/rest doesn't work.
    // it's using the wrong GH api url and format.
    // (does a PUT to /repos/owner/repo/environments with {environment_name: $name} in the request body)
    // this is the correct request URL and format.
    // https://docs.github.com/en/rest/reference/repos#create-or-update-an-environment
    const result = await request("PUT /repos/{owner}/{repo}/environments/{environment_name}", {
      headers: {
        authorization: `token ${githubToken}`,
      },
      owner: owner,
      repo: repo,
      environment_name: environmentName,
    });

    if (result && (result.status >= 200 && result.status < 300)) {
      console.log("Created GitHub environment: " + environmentName);
    }
    console.log(result);

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
    sourceData["jobs"]["GA-Data-Importer"]["environment"] = environmentName;

    let yamlStr = yaml.dump(sourceData);
    fs.writeFileSync(destination, yamlStr, 'utf8');

    console.log("setup a new github action at " + destination + " in env " + environmentName);

  } catch (e) {
    console.error(e);
  }
}

async function setupGoogleAnalytics(name, url) {
  analytics.management.webproperties.insert(
    {
      accountId: googleAnalyticsAccountID,
      resource: {
        websiteUrl: url,
        name: name,
      }
  })
  .then((response) => {
    let propertyId = response.data.id;
    console.log(`[GA] Created property with ID ${propertyId} for ${response.data.name} on domain ${response.data.websiteUrl}`);

    // create the view (aka profile)
    analytics.management.profiles.insert(
      {
        accountId: googleAnalyticsAccountID,
        webPropertyId: propertyId,
        resource: {
          name: `${name} website`,
          botFilteringEnabled: true,
        }
    })
    .then( (res) => {
      console.log(`[GA] Created view with ID ${res.data.id}`);
      console.log(`[GA] Current status of accounts:`);
      analytics.management.webproperties.list({'accountId': googleAnalyticsAccountID})
      .then((response) => {
        if (response.data.items && response.data.items.length) {
          response.data.items.map( (item) => {
            console.log(`[GA] * ${item.id}: ${item.name} (${item.profileCount} profiles)` )
          })
        } else {
          console.error("No properties found in GA Account:", googleAnalyticsAccountID);
        }
      })
      .catch((e) => console.error("[GA] Error listing accounts:", e ));

    })
    .catch((e) => console.error("[GA] Error creating view:", e ));
  })
  .catch((e) => console.error("[GA] Error creating property:", e ));

}

async function setupGoogleDrive(org, emails) {
  let topLevelFolderId = process.env.DRIVE_PARENT_FOLDER_ID;
  drive.files.get({fileId: topLevelFolderId, supportsAllDrives: true, fields: "id,name,webViewLink"}, (err, res) => {
    if (err) throw err;
    console.log('Creating a folder for org: ' + org);

    // create the folder here
    var orgFolderMetadata = {
      'name': org,
      parents: [topLevelFolderId],
      'mimeType': 'application/vnd.google-apps.folder',
    };

    drive.files.create({
      resource: orgFolderMetadata,
      fields: '*',
      supportsAllDrives: true
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log(file.data.name + " folder created: " + file.data.webViewLink);
        webLink = file.data.webViewLink;

        var parentFolderId = file.data.id

        if (emails) {
          emails.forEach(function (email) {
            console.log("Granting permission to " + email);

            drive.permissions.create({
              resource: {
                  'type': 'user',
                  'role': 'writer',
                  'emailAddress': email
              },
              supportsAllDrives: true,
              fileId: parentFolderId,
              fields: 'id',
              }, function(err, res) {
                  if (err) {
                  // Handle error
                  console.log("🤬 Error granting permissions to " + email + ":", err);
              } else {
                  console.log('✅ Successfully granted permission to ' + email);
              }
            });
          });
        }

        console.log("🗄️ Created folder for organization", org, "with id:", parentFolderId);

        var articleFolderMetadata = {
          'name': 'articles',
          parents: [parentFolderId],
          'mimeType': 'application/vnd.google-apps.folder'
        };

        drive.files.create({
          resource: articleFolderMetadata,
          supportsAllDrives: true,
          fields: 'id'
        }, function (err, file) {
          if (err) {
            // Handle error
            console.log("🤬 Error creating articles folder: ", err);
          } else {
            var articleFolderId = file.data.id;
            console.log('📁 Created articles folder within', org, 'with id:', articleFolderId);

            var articleMetadata = {
              'name': 'Article TK',
              parents: [articleFolderId],
              'mimeType': 'application/vnd.google-apps.document'
            };

            drive.files.create({
              resource: articleMetadata,
              supportsAllDrives: true,
              fields: 'id'
            }, function (err, file) {
              if (err) {
                // Handle error
                console.log("🤬 Error creating test article document: ", err);
              } else {
                console.log('🗒️ Created test article document (for configuring the add-on) with id: ', file.data.id);
              }
            });
          }
        });

        var pageFolderMetadata = {
          'name': 'pages',
          parents: [parentFolderId],
          'mimeType': 'application/vnd.google-apps.folder'
        };

        drive.files.create({
          resource: pageFolderMetadata,
          supportsAllDrives: true,
          fields: 'id'
        }, function (err, file) {
          if (err) {
            // Handle error
            console.log("🤬 Error creating pages folder: ", err);
          } else {
            console.log('📁 Created pages folder within', org, 'with id:', file.data.id);
          }
        });
      }
    });
  })
}

// sets up org-specific ENV values
function configureNext(name, slug, locales) {
  const currentEnv = require('dotenv').config({ path: '.env.local' })

  if (currentEnv.error) {
    throw currentEnv.error
  }

  // set these to the new organization values
  currentEnv.parsed['ORG_NAME'] = name;
  currentEnv.parsed['ORG_SLUG'] = slug;
  currentEnv.parsed['TNC_AWS_DIR_NAME'] = slug;
  currentEnv.parsed['TNC_AWS_BUCKET_NAME'] = `tnc-uploads-${slug}`;

  let previousLocales = currentEnv.parsed['LOCALES'].split(',');
  currentEnv.parsed['LOCALES'] = arrayUnique(locales.concat(previousLocales)).join(',');

  var stream = fs.createWriteStream(".new.env.local", {flags:'a'});
  Object.keys(currentEnv.parsed).map((key) =>{
    stream.write(`${key}=${currentEnv.parsed[key]}` + "\n");
  })
  stream.end();

  let newEnvFilename = `.env.local-${slug}`
  fs.rename('.new.env.local', newEnvFilename, function (err) {
    if (err) throw err
    console.log(`Successfully configured env in ${newEnvFilename} with:\n`, JSON.stringify(currentEnv));
  })
}

async function createOrganization(opts) {
  let name = opts.name;
  let slug = opts.slug;
  let emails = opts.emails;
  let locales = opts.locales;
  let url = opts.url;

  configureNext(name, slug, locales);

  const { errors, data } = await shared.hasuraInsertOrganization({
    url: apiUrl,
    adminSecret: adminSecret,
    name: name,
    slug: slug,
  })

  if (errors) {
    console.error("Error creating a record for organization with name '" + name + "':", errors);
  } else {
    organizationID = data.insert_organizations_one.id;
    console.log("Created a record for organization with ID " + organizationID, data);

    shared.hasuraListAllLocales({
      url: apiUrl,
      adminSecret: adminSecret,
    })
    .then((res) => {

      let allLocales = res.data.locales;
      let orgLocaleObjects = [];
      allLocales.forEach( (aLocale) => {
        let foundLocale = locales.find( l => l === aLocale.code);
        if (foundLocale)  {
          orgLocaleObjects.push({
            locale_id: aLocale.id,
            organization_id: organizationID
          })
        }
        shared.hasuraInsertSections({
          url: apiUrl,
          adminSecret: adminSecret,
          objects: [
            {
              organization_id: organizationID,
              title: "News",
              slug: "news",
              published: true,
              category_translations: {
                data: {
                  locale_code: aLocale.code,
                  title: "News"
                },
                on_conflict: {constraint: "category_translations_locale_code_category_id_key", update_columns: "title"}
              }
            },
            {
              organization_id: organizationID,
              title: "Politics",
              slug: "politics",
              published: false,
              category_translations: {
                data: {
                  locale_code: aLocale.code,
                  title: "Politics"
                },
                on_conflict: {constraint: "category_translations_locale_code_category_id_key", update_columns: "title"}
              }
            },
            {
              organization_id: organizationID,
              title: "COVID-19",
              slug: "covid-19",
              published: false,
              category_translations: {
                data: {
                  locale_code: aLocale.code,
                  title: "COVID-19"
                },
                on_conflict: {constraint: "category_translations_locale_code_category_id_key", update_columns: "title"}
              }
            },
          ]
        }).then( (res) => {
          console.log("Created the default sections:", res);
          shared.hasuraUpsertHomepageLayout({
            url: apiUrl,
            adminSecret: adminSecret,
            organization_id: organizationID,
            name: "Large Package Story Lead",
            data: "{ \"subfeatured-top\":\"string\", \"subfeatured-bottom\":\"string\", \"featured\":\"string\" }"
          }).then ( (res) => {
            console.log("Created the Large Package Story Lead homepage layout:", res);
            shared.hasuraUpsertHomepageLayout({
              url: apiUrl,
              adminSecret: adminSecret,
              organization_id: organizationID,
              name: "Big Featured Story",
              data: "{ \"featured\":\"string\" }"
            }).then ( (res) => {
              console.log("Created the Big Featured Story homepage layout:", res);
            })
          })
        })
      })
      shared.hasuraInsertOrgLocales({
        url: apiUrl,
        adminSecret: adminSecret,
        orgLocales: orgLocaleObjects
      }).then((res) => {
        console.log("Setup locales for the organization:", res);

        let siteMetadata = {
          "color": "colorone",
          "theme": "styleone",
          "siteUrl": "https://tinynewsco.org/",
          "aboutCTA": "Learn more",
          "aboutDek": `About the ${name} TK`,
          "aboutHed": "Who We Are",
          "bodyFont": "Source Sans Pro",
          "shortName": name,
          "supportCTA": "Donate",
          "supportDek": `${name} exists based on the support of our readers. Chip in today to help us continue delivering quality journalism.`,
          "supportHed": "Support our work",
          "supportURL": "https://tiny-news-collective.monkeypod.io/give/support-the-oaklyn-observer?secret=84fc2987ea6e8f11b8f4f8aca8b749d7",
          "footerTitle": "tinynewsco.org",
          "headingFont": "Source Serif Pro",
          "landingPage": false,
          "searchTitle": name,
          "primaryColor": "#de7a00",
          "twitterTitle": "Twitter title",
          "facebookTitle": "Facebook title",
          "homepageTitle": name,
          "membershipDek": "Support great journalism by becoming a member for a low monthly price.",
          "membershipHed": "Become a member",
          "newsletterDek": `Get the latest headlines from ${name} right in your inbox.`,
          "newsletterHed": "Sign up for our newsletter",
          "donateBlockDek": "Support our local journalism with a monthly pledge.",
          "donateBlockHed": "Donate",
          "secondaryColor": "#002c57",
          "donationOptions": "[{\n\"uuid\": \"92f77857-eea6-4035-ae86-e9781e2627b2\",\n\"amount\": 5,\n\"name\": \"Member\"\n},\n{\n\"uuid\": \"92f778a9-3187-4fe5-9d6b-a3041f126456\",\n\"amount\": 10,\n\"name\": \"Supporter\"\n},\n{\n\"uuid\": \"92f77888-d1cc-4491-8080-780f0b109320\",\n\"amount\": 20,\n\"name\": \"Superuser\"\n}]",
          "footerBylineLink": "https://newscatalyst.org",
          "footerBylineName": "News Catalyst",
          "searchDescription": "Page description",
          "twitterDescription": "Twitter description",
          "facebookDescription": "Facebook description"
        };

        locales.map( (locale) => {
          shared.hasuraUpsertMetadata({
            url: apiUrl,
            adminSecret: adminSecret,
            organization_id: organizationID,
            data: siteMetadata,
            locale_code: locale,
            published: true,
          }).then( (res) => {
            console.log("created site metadata for " + name + " in locale " + locale);
          })
        })

        setupGoogleDrive(slug, emails);
        setupGoogleAnalytics(name, url);

        setupGitHubAction(slug);

        console.log("Make sure to review settings in the tinycms once this is done!")
      })
    })
    .catch(console.error);
  }
}

function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
}

program
    // .requiredOption('-n, --name <name>', 'the name of the new organization')
    .requiredOption('-s, --slug <slug>', 'a short (A-Za-z0-9_) slug for the organization')
    // .requiredOption('-l, --locales [locales...]', 'specify supported locales')
    // .requiredOption('-e, --emails [emails...]', 'specify emails for org members (needed for google drive)')
    // .requiredOption('-u, --url <url>', 'specify the url on vercel, used for GA property setup')
    .description("sets up a new organization in Hasura and Google Drive")
    .action( (opts) => {
      createGitHubEnv(opts.slug)
      // createOrganization(opts);
      // vercel.createProject(opts.name, opts.slug);
    });

program.parse(process.argv);
