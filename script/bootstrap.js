#! /usr/bin/env node

const { program } = require('commander');
program.version('0.0.1');

const { google } = require("googleapis");
const credentials = require("./credentials.json");
const scopes = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);
const drive = google.drive({ version: "v3", auth });

const shared = require("./shared");

require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

const metadata = {
  "shortName": "The New Oaklyn Observer",
  "siteUrl": "https://tinynewsco.org/",
  "homepageTitle": "The New Oaklyn Observer",
  "homepageSubtitle": "a new local news initiative",
  "subscribe": "{\"title\":\"Subscribe\",\"subtitle\":\"Get the latest news from Oaklyn in your inbox.\"}",
  "footerTitle": "tinynewsco.org",
  "footerBylineName": "News Catalyst",
  "footerBylineLink": "https://newscatalyst.org",
  "labels": "{\"latestNews\":\"Latest News\",\"search\":\"Search\",\"topics\":\"Topics\"}",
  "nav": "{\"articles\":\"Articles\",\"topics\":\"All Topics\",\"cms\":\"tinycms\"}",
  "searchTitle": "The Oaklyn Observer",
  "searchDescription": "Page description",
  "facebookTitle": "Facebook title",
  "facebookDescription": "Facebook description",
  "twitterTitle": "Twitter title",
  "twitterDescription": "Twitter description",
  "aboutHed": "Who We Are",
  "aboutDek": "We’re journalists for Oaklyn. We amplify community voices, share information resources, and investigate systems, not just symptoms.",
  "aboutCTA": "Learn more",
  "supportHed": "Support our work",
  "supportDek": "The Oaklyn Observer exists based on the support of our readers. Chip in today to help us continue serving Oaklyn with quality journalism.",
  "supportCTA": "Donate",
  "theme": "styleone",
  "color": "colorone",
  "landingPage": true,
};

let organizationID;

async function setupGoogleDrive(emails) {
  let org = process.env.ORG_SLUG;
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

async function createOrganization(locales) {
  const { errors, data } = await shared.hasuraInsertOrganization({
    url: apiUrl,
    adminSecret: adminSecret,
    name: process.env.ORG_NAME,
    slug: process.env.ORG_SLUG,
  })

  if (errors) {
    console.error("Error creating record for organization:", errors);
  } else {
    organizationID = data.insert_organizations_one.id;
    console.log("Created record for organization with ID " + organizationID, data);

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
        shared.hasuraUpsertSection({
          url: apiUrl,
          adminSecret: adminSecret,
          organization_id: organizationID,
          title: "News",
          slug: "news",
          localeCode: aLocale.code,
          published: true
        }).then( (res) => {
          console.log("result creating general news section:", res);
          shared.hasuraUpsertHomepageLayout({
            url: apiUrl,
            adminSecret: adminSecret,
            organization_id: organizationID,
            name: "Large Package Story Lead",
            data: "{ \"subfeatured-top\":\"string\", \"subfeatured-bottom\":\"string\", \"featured\":\"string\" }"
          }).then ( (res) => {
            console.log("result creating large package story lead:", res);
            shared.hasuraUpsertHomepageLayout({
              url: apiUrl,
              adminSecret: adminSecret,
              organization_id: organizationID,
              name: "Big Featured Story",
              data: "{ \"featured\":\"string\" }"
            }).then ( (res) => {
              console.log("result creating big featured story layout:", res);

              shared.hasuraUpsertMetadata({
                url: apiUrl,
                adminSecret: adminSecret,
                organization_id: organizationID,
                data: metadata,
                published: true,
                localeCode: aLocale.code
              }).then( (res) => console.log("result creating metadata:", res));

            })
          })
        })
      }) 
      shared.hasuraInsertOrgLocales({
        url: apiUrl,
        adminSecret: adminSecret,
        orgLocales: orgLocaleObjects
      }).then((res) => {
        console.log("result:", res);
      })
    })
    .catch(console.error);
  }
}

program
    .option('-l, --locales [locales...]', 'specify supported locales')
    .option('-e, --emails [emails...]', 'specify emails for org members (needed for google drive)')
    .description("sets up a new organization in Hasura and Google Drive")
    .action( (opts) => {
      console.log("opts.emails: ", opts.emails);
      console.log("opts.locales: ", opts.locales);

      createOrganization(opts.locales);
      setupGoogleDrive(opts.emails);
    });

program.parse(process.argv);
