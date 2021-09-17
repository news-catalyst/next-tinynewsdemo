/// <reference types="cypress" />
const fetch = require('node-fetch');

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
  const apiGraphQL = config.env.apiUrl;

  on('task', {
    async 'db:authors'() {
      // seed database with test data
      const { errors, data } = await deleteAllAuthors({
        url: apiGraphQL,
        orgSlug: 'test-org',
      });
      if (errors) {
        console.error('errors:', errors);
      }
      console.log('data:', data);
      return data;
    },
    async 'db:tags'() {
      console.log('DELETING ALL TAGS!', apiGraphQL);
      // seed database with test data
      const { errors, data } = await deleteAllTags({
        url: apiGraphQL,
        orgSlug: 'test-org',
      });
      if (errors) {
        console.error('errors:', errors);
      }
      console.log('data:', data);
      return data;
    },
    async 'db:articles'() {
      // clear out existing articles
      const { errors, data } = await hasuraDeleteArticles(orgParams);
      if (errors) {
        console.error('errors deleting articles:', errors);
      }
      console.log('data:', data);
      return data;
    },
  });
};
// eslint-disable-next-line no-unused-vars
