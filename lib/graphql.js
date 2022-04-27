import fetch from 'node-fetch';

const ORG_SLUG = process.env.ORG_SLUG;
const HASURA_API_URL = process.env.HASURA_API_URL;

// Implementation from https://gist.github.com/codeguy/6684588
// takes a regular string and returns a slug
export const slugify = (value) => {
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  value = value.trim();
  value = value.toLowerCase();
  var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  var to = 'aaaaeeeeiiiioooouuuunc------';
  for (var i = 0, l = from.length; i < l; i++) {
    value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  value = value
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return value;
};

export async function fetchGraphQL(params) {
  let url;
  let orgSlug;
  let adminSecret;
  let site;

  // console.log('BUILD_MODE:', process.env.BUILD_MODE);

  if (Object.prototype.hasOwnProperty.call(params, 'url')) {
    url = params['url'];
  } else {
    url = HASURA_API_URL;
  }

  if (Object.prototype.hasOwnProperty.call(params, 'adminSecret')) {
    adminSecret = params['adminSecret'];
  }

  if (Object.prototype.hasOwnProperty.call(params, 'site')) {
    site = params['site'];
  }

  if (Object.prototype.hasOwnProperty.call(params, 'orgSlug')) {
    orgSlug = params['orgSlug'];
  }

  let requestHeaders = {};

  // if we're in automated test mode, hardcode the headers to skip needing a separate webhook
  // TODO: allow passing custom headers in tests to simulate different orgs

  if (!adminSecret && orgSlug) {
    requestHeaders = {
      'TNC-Organization': orgSlug,
    };
  } else if (site) {
    // if (process.env.BUILD_MODE && process.env.BUILD_MODE === 'test') {
    //   requestHeaders = {
    //     'X-Hasura-Role': 'organization',
    //     'X-Hasura-Organization-Id': '772',
    //   };
    // } else {
    requestHeaders = {
      'TNC-Site': site,
    };
    // }
  } else if (adminSecret) {
    requestHeaders = {
      'x-hasura-admin-secret': adminSecret,
    };
  }

  let operationQuery = params['query'];
  let operationName = params['name'];
  let variables = params['variables'];

  let stringifiedData;
  try {
    stringifiedData = JSON.stringify({
      query: operationQuery,
      variables: variables,
      operationName: operationName,
    });
  } catch (error) {
    console.error(error);
  }

  if (Object.keys(requestHeaders).length <= 0) {
    console.log(
      '***** Missing auth for this request:',
      operationName,
      stringifiedData
    );
  }

  const result = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: stringifiedData,
  });

  return await result.json();
}
