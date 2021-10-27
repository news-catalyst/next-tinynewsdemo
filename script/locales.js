// Locales data from https://datahub.io/core/language-codes (language-codes.json)

const shared = require('./shared');
require('dotenv').config({ path: '.env.local' });

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

let locales = require('../data/locales.json');

console.log(
  `Loading ${locales.length} languages from the language-codes master list`
);

let insertLocales = [];

locales.map((locale) => {
  if (!['en', 'es', 'fil'].includes(locale.alpha2)) {
    insertLocales.push({
      code: locale.alpha2,
      name: locale.English,
    });
  }
});

console.log(
  `Adding ${insertLocales.length} locales into Hasura's locales table...`
);

shared
  .hasuraAdminInsertLocales({
    url: apiUrl,
    adminSecret: adminSecret,
    locales: insertLocales,
  })
  .then((res) => {
    if (res.errors) {
      console.error('Something went wrong:', res.errors);
    } else {
      console.log('Done:', JSON.stringify(res.data));
    }
  });
