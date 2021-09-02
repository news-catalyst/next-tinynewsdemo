const shared = require("./shared");
require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

let locales = ["en-US", "fil"];
let organizationID = 101;

let url = "https://diaryo.newscatalyst.org";
let name = "Test Diaryo";


let siteMetadata = {
  "color": "colorone",
  "theme": "styleone",
  "siteUrl": url,
  "aboutCTA": "Learn more",
  "aboutDek": `About the ${name} TK`,
  "aboutHed": "Who We Are",
  "bodyFont": "Domine",
  "shortName": name,
  "supportCTA": "Donate",
  "supportDek": `${name} exists based on the support of our readers. Chip in today to help us continue delivering quality journalism.`,
  "supportHed": "Support our work",
  "supportURL": "https://tiny-news-collective.monkeypod.io/give/support-the-oaklyn-observer?secret=84fc2987ea6e8f11b8f4f8aca8b749d7",
  "footerTitle": url,
  "headingFont": "Libre Franklin",
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
  "donationOptions": "[{\n\"amount\": 5,\n\"name\": \"Member\",\n\"description\": \"This is a description.\"\n},\n{\n\"amount\": 10,\n\"name\": \"Supporter\",\n\"description\": \"This is a description.\"\n},\n{\n\"amount\": 20,\n\"name\": \"Superuser\",\n\"description\": \"This is a description.\"\n}]",
  "footerBylineLink": url,
  "footerBylineName": name,
  "searchDescription": "Page description",
  "twitterDescription": "Twitter description",
  "facebookDescription": "Facebook description",
  "commenting": "on"
};

locales.map( (locale) => {
  console.log("Saving site metadata for locale " + locale);

  shared.hasuraUpsertMetadata({
    url: apiUrl,
    adminSecret: adminSecret,
    organization_id: organizationID,
    data: JSON.stringify(siteMetadata),
    locale_code: locale,
    published: true,
  }).then( (res) => {
    if (res.errors) {
      console.error("failed creating site metadata in locale " + locale + ":")
      console.error(JSON.stringify(res.errors));
    } else {
      console.log("successfully created site metadata in locale " + locale + ":");
      console.log(JSON.stringify(res));
    }

  }).catch(err => console.error(err));

})