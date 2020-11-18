#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
const fetch = require("node-fetch");

const CONTENT_DELIVERY_API_URL = 'https://d27ff8ul81gmi2.cloudfront.net/graphql';
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  'a353ae2f42f7c81a0f4937dfa532432a436aee6a74a7c27a';

function writeCache(name, data) {
  const cachedFile = path.join(process.cwd(), 'cached', `${name}.json`);
  console.log(cachedFile);
  fs.writeFileSync(cachedFile, JSON.stringify(data), { flag: 'wx' }, (err) => {
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
  `
  const url = CONTENT_DELIVERY_API_URL;
  let opts = {
    method: "POST",
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  };
  fetch(url, opts)
    .then(res => res.json())
    .then(data => {
      let sections = data.data.categories.listCategories.data;
      writeCache("sections", sections);
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
  `
  const url = CONTENT_DELIVERY_API_URL;
  console.log(url, process.env.CONTENT_DELIVERY_API_URL);
  let opts = {
    method: "POST",
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  };
  fetch(url, opts)
    .then(res => res.json())
    .then(data => {
      let tags = data.data.tags.listTags.data;
      writeCache("tags", tags);
    })
    .catch(console.error);
}

async function main() {
  listSections();
  listTags();
}

main().catch((error) => console.error(error))
