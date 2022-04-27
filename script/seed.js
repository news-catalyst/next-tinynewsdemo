#! /usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const faker = require('faker');

const shared = require('./shared');

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;
const site = process.env.SITE;

async function seed() {
  const { errors, data } = await shared.seedData({
    url: apiUrl,
    site: site,
    org: {
      name: faker.company.companyName(),
      subdomain: site,
      slug: site,
    },
    adminSecret: adminSecret,
  });

  if (errors) {
    console.error('errors:', errors);
  }

  console.log('seeded data:', data);
}

seed();
