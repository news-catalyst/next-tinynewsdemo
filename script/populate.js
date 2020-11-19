#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

function writeCache(name, data) {
  const cachedFile = path.join(process.cwd(), 'cached', `${name}.json`);
  console.log(cachedFile);
  fs.writeFileSync(cachedFile, JSON.stringify(data), { flag: 'w' }, (err) => {
    console.log('failed to write file:', err);
  });
}

function listSections() {
  const query = `
    {
      categories {
        listCategories {
          data {
            id
            slug
            title {
              values {
                value
                locale
              }
            }
          }
        }
      }
    }
  `;
  const url = CONTENT_DELIVERY_API_URL;
  let opts = {
    method: 'POST',
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  };
  fetch(url, opts)
    .then((res) => res.json())
    .then((data) => {
      let sections = data.data.categories.listCategories.data;
      writeCache('sections', sections);
    })
    .catch(console.error);
}

function listTags() {
  const query = `
    {
      tags {
        listTags {
          data {
            id
            slug
            title {
              values {
                value
                locale
              }
            }
          }
        }
      }
    }
  `;
  const url = CONTENT_DELIVERY_API_URL;
  console.log(url, process.env.CONTENT_DELIVERY_API_URL);
  let opts = {
    method: 'POST',
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  };
  fetch(url, opts)
    .then((res) => res.json())
    .then((data) => {
      let tags = data.data.tags.listTags.data;
      writeCache('tags', tags);
    })
    .catch(console.error);
}

function getAds() {
  const url = process.env.LETTERHEAD_API_URL;
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
    });
}

async function main() {
  listSections();
  listTags();
  getAds();
}

main().catch((error) => console.error(error));
