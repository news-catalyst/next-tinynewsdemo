import { hasuraCreateSection, hasuraListAllSectionsByLocale } from '../lib/section';

require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const apiToken = "oaklyn";

let params = {
  url: apiUrl,
  orgSlug: apiToken
};


describe('categories', () => {
  it('creates a category', () => {
    params['localeCode'] = 'en-US';
    params['title'] = 'News';
    params['published'] = true;
    params['slug'] = 'news';

    return hasuraCreateSection(params).then(response => {
      expect(response.data).toHaveProperty('insert_categories_one.id');
      expect(response.data).toHaveProperty('insert_categories_one.slug');
      expect(response.data).toHaveProperty('insert_categories_one.category_translations');
    });
  });
  it('lists all categories by locale', () => {
    params['localeCode'] = 'en-US';
    return hasuraListAllSectionsByLocale(params).then(response => {
      expect(response.data).toHaveProperty(['categories', 0, 'id']);
      expect(response.data).toHaveProperty(['categories', 0, 'slug']);
      expect(response.data).toHaveProperty(['categories', 0, 'published']);
      expect(response.data).toHaveProperty(['categories', 0, 'category_translations']);
    })
  });
});