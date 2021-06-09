import { hasuraListLocales } from '../lib/articles';
require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const apiToken = "oaklyn";

let params = {
  url: apiUrl,
  orgSlug: apiToken
};

it('lists locales for oaklyn', () => {
  // params['name'] = 'FrontendListOrgLocales';
  // params['query'] = HASURA_LIST_ORG_LOCALES;

  return hasuraListLocales(params).then(response => {
    expect(response.data).toHaveProperty('organization_locales');
    expect(response.data.organization_locales).toHaveLength(2);

    expect(response.data.organization_locales[0]).toHaveProperty("locale");
    expect(response.data.organization_locales[0]['locale']).toHaveProperty("code");
    expect(response.data.organization_locales[0]['locale']['code']).toEqual("en-US");

    expect(response.data.organization_locales[1]).toHaveProperty("locale");
    expect(response.data.organization_locales[1]['locale']).toHaveProperty("code");
    expect(response.data.organization_locales[1]['locale']['code']).toEqual("es");
  });
});
