#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const shared = require("./shared");

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

let organizationID;

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
      console.log("all locales: ", res)
      let allLocales = res.data.locales;
      let orgLocaleObjects = [];
      console.log("locales:", allLocales)
      allLocales.forEach( (aLocale) => {
        let foundLocale = locales.find( l => l === aLocale.code);
        if (foundLocale)  {
          orgLocaleObjects.push({
            locale_id: aLocale.id,
            organization_id: organizationID
          })
        }
      }) 
      console.log("orgLocales:", orgLocaleObjects);
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

async function createGeneralNewsCategory() {
  const localeResult = await shared.hasuraListLocales({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let locales;
  if (localeResult.errors) {
    console.error("Error listing locales:", localeResult.errors);
  } else {
    locales = localeResult.data.organization_locales;
  }

  for (var i = 0; i < locales.length; i++) {
    let locale = locales[i].locale.code;
    const { errors, data } = await shared.hasuraUpsertSection({
      url: apiUrl,
      orgSlug: apiToken,
      title: "News",
      slug: "news",
      localeCode: locale,
      published: true
    })

    if (errors) {
      console.error("Error creating general news category:", errors);
    } else {
      console.log("Created general news category:", locale, data.insert_categories.returning);
    }
  }
}

async function createHomepageLayout1() {
  const { errors, data } = await shared.hasuraUpsertHomepageLayout({
    url: apiUrl,
    orgSlug: apiToken,
    name: "Large Package Story Lead",
    data: "{ \"subfeatured-top\":\"string\", \"subfeatured-bottom\":\"string\", \"featured\":\"string\" }"
  })

  if (errors) {
    console.error("Error creating large package story layout:", errors);
  } else {
    console.log("Created large package story layout:", data);
  }
}

async function createHomepageLayout2() {
  const { errors, data } = await shared.hasuraUpsertHomepageLayout({
    url: apiUrl,
    orgSlug: apiToken,
    name: "Big Featured Story",
    data: "{ \"featured\":\"string\" }"
  })

  if (errors) {
    console.error("Error creating big featured story layout:", errors);
  } else {
    console.log("Created big featured story layout:", data);
  }
}


async function createMetadata() {
  const data = {
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

  const localeResult = await shared.hasuraListLocales({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let locales;
  if (localeResult.errors) {
    console.error("Error listing locales:", localeResult.errors);
  } else {
    locales = localeResult.data.organization_locales;
  }

  for (var i = 0; i < locales.length; i++) {
    let locale = locales[i].locale.code;
    let result = await shared.hasuraUpsertMetadata({
      url: apiUrl,
      orgSlug: apiToken,
      data: data,
      published: true,
      localeCode: locale
    });

    if (result.errors) {
      console.error("Error creating site metadata:", result.errors);
    } else {
      console.log("Successfully created site metadata in locale", locale);
    }
  }
}

async function main() {

  let locales = process.argv.slice(2);
  console.log(locales)

  // insert into organizations
  createOrganization(locales);
  // insert into organization_locales
  // setupLocales(locales);
  // create google drive folder

  // createGeneralNewsCategory();
  // createHomepageLayout1();
  // createHomepageLayout2();
  // createMetadata();
}

main().catch((error) => console.error(error));
