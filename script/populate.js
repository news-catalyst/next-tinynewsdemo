#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const shared = require('./shared');

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

function writeCache(name, data) {
  const cachedFile = path.join(process.cwd(), 'cached', `${name}.json`);
  console.log(cachedFile);
  fs.writeFileSync(cachedFile, JSON.stringify(data), { flag: 'w' }, (err) => {
    console.log('failed to write file:', err);
  });
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
  getAds();
}

main().catch((error) => console.error(error));
