#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const shared = require("./shared");

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

function writeCache(name, data) {
  const cachedFile = path.join(process.cwd(), 'cached', `${name}.json`);
  console.log(cachedFile);
  fs.writeFileSync(cachedFile, JSON.stringify(data), { flag: 'w' }, (err) => {
    console.log('failed to write file:', err);
  });
}

async function listLocales() {
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

  writeCache('locales', locales);
}

async function listSections() {
  const result = await shared.hasuraListSections({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let sections;
  if (result.errors) {
    console.error("Error listing sections:", result.errors);
  } else {
    sections = result.data.categories;
  }
  writeCache('sections', sections);
}

async function listTags() {
  const result = await shared.hasuraListTags({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let tags;
  if (result.errors) {
    console.error("Error listing tags:", result.errors);
  } else {
    tags = result.data.tags;
  }
  writeCache('tags', tags);
}

function getAds() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  today = `${yyyy}-${mm}-${dd}`;

  const url = `${process.env.LETTERHEAD_API_URL}promotions?date=${today}`;
  const opts = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LETTERHEAD_API_KEY}`,
    },
  };
  fetch(url, opts)
    .then((res) => res.json())
    .then((data) => {
      writeCache('ads', data);
    })
    .catch(console.error);
}

async function main() {
  console.log("HASURA_API_URL:", process.env.HASURA_API_URL, "ORG_SLUG:", process.env.ORG_SLUG);
  listLocales();
  listSections();
  listTags();
  getAds();
}

main().catch((error) => console.error(error));
