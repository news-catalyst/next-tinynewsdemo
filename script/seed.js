#! /usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const faker = require('faker');

const shared = require('./shared');

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;
const orgSlug = process.env.ORG_SLUG;

async function seed() {
  const { errors, data } = await shared.seedData({
    url: apiUrl,
    orgSlug: orgSlug,
    org: {
      name: faker.company.companyName(),
      slug: orgSlug,
    },
    adminSecret: adminSecret,
  });

  if (errors) {
    console.error('errors:', errors);
  }

  console.log('seeded data:', data);
}

seed();
