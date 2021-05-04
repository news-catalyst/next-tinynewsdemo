#! /usr/bin/env node

const { program } = require('commander');
program.version('0.0.1');

const fs = require('fs');

const { google } = require("googleapis");
const credentials = require("./credentials.json");
const scopes = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);
const drive = google.drive({ version: "v3", auth });

const shared = require("./shared");
const vercel = require("./vercel");

require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

let organizationID;

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
          "nav": "{\"articles\":\"Articles\",\"topics\":\"All Topics\",\"cms\":\"tinycms\"}",
          "color": "colorone",
          "theme": "styleone",
          "labels": "{\"latestNews\":\"Latest News\",\"search\":\"Search\",\"topics\":\"Topics\"}",
          "siteUrl": "https://tinynewsco.org/",
          "aboutCTA": "Learn more",
          "aboutDek": `About the ${name} TK`,
          "aboutHed": "Who We Are",
          "bodyFont": "Source Sans Pro",
          "shortName": name,
          "subscribe": "{\"title\":\"Subscribe\",\"subtitle\":\"Get the latest news in your inbox.\"}",
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
          "homepageSubtitle": "a new local news initiative",
          "searchDescription": "Page description",
          "twitterDescription": "Twitter description",
          "facebookDescription": "Facebook description"
        };

        allLocales.map( (locale) => {
          shared.hasuraUpsertMetadata({
            url: apiUrl,
            adminSecret: adminSecret,
            organization_id: organizationID,
            data: siteMetadata,
            locale_code: locale.code,
            published: true,
          }).then( (res) => {
            console.log("created site metadata for " + name + " in locale " + locale.code);
          })
        })

        setupGoogleDrive(slug, emails);

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
    .requiredOption('-n, --name <name>', 'the name of the new organization')
    .requiredOption('-s, --slug <slug>', 'a short (A-Za-z0-9_) slug for the organization')
    .requiredOption('-l, --locales [locales...]', 'specify supported locales')
    .requiredOption('-e, --emails [emails...]', 'specify emails for org members (needed for google drive)')
    .description("sets up a new organization in Hasura and Google Drive")
    .action( (opts) => {
      console.log("opts.name: ", opts.name);
      console.log("opts.slug: ", opts.slug);
      console.log("opts.emails: ", opts.emails);
      console.log("opts.locales: ", opts.locales);

      createOrganization(opts);
      vercel.createProject(opts.name, opts.slug);
    });

program.parse(process.argv);
