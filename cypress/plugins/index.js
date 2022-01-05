/// <reference types="cypress" />
const fetch = require('node-fetch');
const faker = require('faker');

const shared = require('../../script/shared');

// const dotenvPlugin = require('cypress-dotenv');

async function fetchGraphQL(params) {
  let url = params['url'];
  let orgSlug = params['orgSlug'];

  let operationQuery = params['query'];
  let operationName = params['name'];
  let variables = params['variables'];

  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'TNC-Organization': orgSlug,
    },
    body: JSON.stringify({
      query: operationQuery,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

const DELETE_AUTHORS_MUTATION = `mutation DeleteAllAuthors {
  delete_author_translations(where: {author_id: {_gt: 0}}) {
    affected_rows
  }
  delete_author_articles(where: {author_id: {_gt: 0}}) {
    affected_rows
  }
  delete_author_pages(where: {author_id: {_gt: 0}}) {
    affected_rows
  }
  delete_authors(where: {id: {_gt: 0}}) {
    affected_rows
  }
}`;

function deleteAllAuthors(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: DELETE_AUTHORS_MUTATION,
    name: 'DeleteAllAuthors',
  });
}

const DELETE_TAGS_MUTATION = `mutation DeleteAllTags {
  delete_tag_translations(where: {tag_id: {_gt: 0}}) {
    affected_rows
  }
  delete_tag_articles(where: {tag_id: {_gt: 0}}) {
    affected_rows
  }
  delete_tags(where: {id: {_gt: 0}}) {
    affected_rows
  }
}`;

function deleteAllTags(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: DELETE_TAGS_MUTATION,
    name: 'DeleteAllTags',
  });
}

async function seedData(params) {
  const deleteOrgResult = await shared.hasuraRemoveOrganization({
    url: params['url'],
    adminSecret: params['adminSecret'],
    slug: params['org']['slug'],
  });
  if (deleteOrgResult.errors) {
    console.error(
      params['adminSecret'],
      'Error deleting organization: ',
      deleteOrgResult.errors
    );
    // return orgResult.errors;
  } else {
    console.log('deleted organization:', deleteOrgResult);
  }
  const orgResult = await shared.hasuraInsertOrganization({
    url: params['url'],
    adminSecret: params['adminSecret'],
    name: params['org']['name'],
    slug: params['org']['slug'],
  });
  if (orgResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating organization: ',
      orgResult.errors
    );
    return orgResult;
  }
  console.log('created organization:', orgResult);

  let organizationID = orgResult.data.insert_organizations_one.id;

  const localeResult = await shared.hasuraInsertLocale({
    url: params['url'],
    adminSecret: params['adminSecret'],
    name: 'English',
    code: 'en-US',
  });
  if (localeResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating locale: ',
      localeResult.errors
    );
    return localeResult;
  }
  console.log('created en-US locale', localeResult);
  let localeID = localeResult.data.insert_locales_one.id;

  let orgLocaleObjects = [
    {
      locale_id: localeID,
      organization_id: organizationID,
    },
  ];

  console.log('orgLocaleObjects:', orgLocaleObjects);
  let orgLocaleResult = await shared.hasuraInsertOrgLocales({
    url: params['url'],
    adminSecret: params['adminSecret'],
    orgLocales: orgLocaleObjects,
  });
  if (orgLocaleResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating org locale: ',
      orgLocaleResult.errors
    );
    return orgLocaleResult;
  }
  console.log('Setup locales for the organization:', orgLocaleResult);

  let siteMetadata = {
    color: 'colorone',
    theme: 'styleone',
    siteUrl: 'https://tinynewsco.org/',
  };
  let metadataResult = await shared.hasuraUpsertMetadata({
    url: params['url'],
    adminSecret: params['adminSecret'],
    organization_id: organizationID,
    data: siteMetadata,
    locale_code: 'en-US',
    published: true,
  });
  if (metadataResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating metadata: ',
      metadataResult.errors
    );
    return metadataResult;
  }
  console.log('Setup metadata for the organization:', metadataResult);

  let sectionResult = await shared.hasuraInsertSections({
    url: params['url'],
    adminSecret: params['adminSecret'],
    objects: [
      {
        organization_id: organizationID,
        title: 'News',
        slug: 'news',
        published: true,
        category_translations: {
          data: {
            locale_code: 'en-US',
            title: 'News',
          },
          on_conflict: {
            constraint: 'category_translations_locale_code_category_id_key',
            update_columns: 'title',
          },
        },
      },
    ],
  });
  if (sectionResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating section: ',
      sectionResult.errors
    );
    return sectionResult;
  }
  console.log('Setup section for the organization:', sectionResult);
  let categoryID = sectionResult.data.insert_categories.returning[0].id;
  let largeLayoutResult = await shared.hasuraUpsertHomepageLayout({
    url: params['url'],
    adminSecret: params['adminSecret'],
    organization_id: organizationID,
    name: 'Large Package Story Lead',
    data:
      '{ "subfeatured-top":"string", "subfeatured-bottom":"string", "featured":"string" }',
  });
  if (largeLayoutResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating large package layout: ',
      largeLayoutResult.errors
    );
    return largeLayoutResult;
  }
  console.log(
    'Setup large package layout for the organization:',
    largeLayoutResult
  );

  let bigLayoutResult = await shared.hasuraUpsertHomepageLayout({
    url: params['url'],
    adminSecret: params['adminSecret'],
    organization_id: organizationID,
    name: 'Big Featured Story',
    data: '{ "featured":"string" }',
  });
  if (bigLayoutResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating big featured layout: ',
      bigLayoutResult.errors
    );
    return bigLayoutResult;
  }
  console.log(
    'Setup big featured layout for the organization:',
    bigLayoutResult
  );
  let authorResult = await shared.hasuraInsertOneAuthor({
    url: params['url'],
    orgSlug: params['orgSlug'],
    first_names: faker.name.firstName(),
    last_name: faker.name.lastName(),
    title: faker.name.jobTitle(),
    twitter: faker.internet.userName(),
    bio: faker.name.jobDescriptor(),
    slug: faker.lorem.slug(),
    email: faker.internet.email(),
  });
  if (authorResult.errors) {
    console.error(
      params['orgSlug'],
      'Error creating author: ',
      authorResult.errors
    );
    return authorResult;
  }
  console.log('Setup author for the organization:', authorResult);
  let authorID = authorResult.data.insert_authors_one.id;

  let tagResult = await shared.hasuraCreateOneTag({
    url: params['url'],
    orgSlug: params['orgSlug'],
    slug: 'latest-news',
    title: 'Latest News',
    locale_code: 'en-US',
  });
  if (tagResult.errors) {
    console.error(params['orgSlug'], 'Error creating tag:', tagResult.errors);
    return tagResult;
  }
  console.log('Setup tag for the organization:', tagResult);
  let tagID = tagResult.data.insert_tags_one.id;

  let gdocResult = await shared.hasuraInsertGoogleDoc({
    url: params['url'],
    orgSlug: params['orgSlug'],
    document_id: '1LSyMzR1KxyKoml6q56DYQaxEV8Qm4EZo2y_xEFIkvGw',
    locale_code: 'en-US',
  });
  if (gdocResult.errors) {
    console.error(
      params['adminSecret'],
      'Error creating test google doc: ',
      gdocResult.errors
    );
    return gdocResult;
  }
  console.log('Setup test google doc for the organization:', gdocResult);
  let googleDocID = gdocResult.data.insert_google_documents_one.id;

  let articleResult = await shared.hasuraInsertTestArticle({
    url: params['url'],
    orgSlug: params['orgSlug'],
    google_document_id: googleDocID,
    locale_code: 'en-US',
    category_id: categoryID,
    slug: 'test-doc-for-article-features',
    content: faker.lorem.paragraph(),
    headline: faker.lorem.sentence(),
    search_title: faker.lorem.sentence(),
    search_description: faker.lorem.paragraph(),
    author_id: authorID,
    tag_id: tagID,
  });
  if (articleResult.errors) {
    console.error(
      params['orgSlug'],
      'Error creating test article: ',
      articleResult.errors
    );
    return articleResult;
  }
  console.log('Setup test article for the organization:', articleResult);
  return orgResult;
}

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // config = dotenvPlugin(config);
  require('dotenv').config({ path: '.env.local' });

  config.env.apiToken = process.env.API_TOKEN;
  config.env.orgSlug = process.env.ORG_SLUG;
  const orgSlug = process.env.ORG_SLUG;
  const apiGraphQL = config.env.apiUrl;
  // const adminSecret = process.env.HASURA_ADMIN_SECRET;
  config.env.adminSecret = process.env.HASURA_ADMIN_SECRET;

  on('task', {
    newTagTitle() {
      return faker.company.catchPhrase();
    },

    newUser() {
      return {
        firstName: faker.name.findName(),
        lastName: faker.name.lastName(),
        title: faker.name.jobTitle(),
      };
    },

    async 'db:seed'() {
      console.log('ENV:', config.env.adminSecret);

      const { errors, data } = await seedData({
        url: apiGraphQL,
        orgSlug: orgSlug,
        org: {
          name: faker.company.companyName(),
          slug: orgSlug,
        },
        adminSecret: config.env.adminSecret,
      });
      if (errors) {
        console.error('errors:', errors);
      }
      console.log('data:', data);
      return data;
    },

    async 'db:authors'() {
      // seed database with test data
      const { errors, data } = await deleteAllAuthors({
        url: apiGraphQL,
        orgSlug: orgSlug,
      });
      if (errors) {
        console.error('errors:', errors);
      }
      // console.log('data:', data);
      return data;
    },
    async 'db:tags'() {
      // console.log('DELETING ALL TAGS!', apiGraphQL);
      // seed database with test data
      const { errors, data } = await deleteAllTags({
        url: apiGraphQL,
        orgSlug: orgSlug,
      });
      if (errors) {
        console.error('errors:', errors);
      }
      // console.log('data:', data);
      return data;
    },
    async 'db:articles'() {
      // clear out existing articles
      const { errors, data } = await hasuraDeleteArticles(orgParams);
      if (errors) {
        console.error('errors deleting articles:', errors);
      }
      // console.log('data:', data);
      return data;
    },
  });

  return config;
};
// eslint-disable-next-line no-unused-vars
