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

  if (Object.prototype.hasOwnProperty.call(params, 'url')) {
    url = params['url'];
  } else {
    url = HASURA_API_URL;
  }

  if (Object.prototype.hasOwnProperty.call(params, 'adminSecret')) {
    adminSecret = params['adminSecret'];
  }

  if (Object.prototype.hasOwnProperty.call(params, 'orgSlug')) {
    orgSlug = params['orgSlug'];
  } else {
    orgSlug = ORG_SLUG;
  }

  let requestHeaders = {};

  if (!adminSecret) {
    requestHeaders = {
      'TNC-Organization': orgSlug,
    };
  } else {
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

  const result = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: stringifiedData,
  });

  return await result.json();
}
