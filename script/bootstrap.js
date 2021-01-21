#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const fetch = require('node-fetch');

const gql = require('../lib/graphql/queries');

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

function createHomepageLayouts() {
  const url = CONTENT_DELIVERY_API_URL;

  const lpslVars = {
    data: {
      name: "Large Package Story Lead",
      data: "{ \"subfeatured-left\":\"string\", \"subfeatured-middle\":\"string\", \"subfeatured-right\":\"string\", \"featured\":\"string\" }"
    }
  };

  const bfsVars = {
    data: {
      name: "Big Featured Story",
      data: "{ \"featured\":\"string\" }"
    }
  };
  
  let opts = {
    method: 'POST',
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({ 
      query: gql.CREATE_LAYOUT_SCHEMA,
      variables: lpslVars
    }),
  };

  fetch(url, opts)
    .then((res) => res.json())
    .then((data) => {
      console.log(JSON.stringify(data));
    })
    .catch(console.error);

  opts.body = JSON.stringify({
      query: gql.CREATE_LAYOUT_SCHEMA,
      variables: bfsVars
  })

  fetch(url, opts)
    .then((res) => res.json())
    .then((data) => {
      console.log(JSON.stringify(data));
    })
    .catch(console.error);
}

async function main() {
  createHomepageLayouts();
}

main().catch((error) => console.error(error));
