import { hasuraGetSectionById, hasuraGetTagById, hasuraCreateTag, hasuraCreateSection, hasuraListAllSectionsByLocale, hasuraUpdateSection, hasuraUpdateTag } from '../lib/section';
import { hasuraListAllTags, hasuraListAllSections, hasuraTagPage, hasuraCategoryPage } from '../lib/articles';

require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const apiToken = "oaklyn";

let params = {
  url: apiUrl,
  orgSlug: apiToken
};

let newsSectionId;
let newTagId;

describe('sections', () => {
  it('creates a section', () => {
    params['localeCode'] = 'en-US';
    params['title'] = 'News';
    params['published'] = true;
    params['slug'] = 'news';

    return hasuraCreateSection(params).then(response => {
      newsSectionId = response.data.insert_categories_one.id;
      expect(response.data).toHaveProperty('insert_categories_one.id');
      expect(response.data).toHaveProperty('insert_categories_one.slug');
      expect(response.data).toHaveProperty('insert_categories_one.category_translations');
    });
  });

  it('updates a section title', () => {
    params['id'] = newsSectionId;
    params['localeCode'] = 'en-US';
    params['title'] = 'Top Stories';
    params['published'] = true;
    params['slug'] = 'news';

    return hasuraUpdateSection(params).then(response => {
      expect(response.data).toHaveProperty('insert_category_translations');
      expect(response.data).toHaveProperty('update_categories_by_pk');
    });
  });

  it('gets a section by ID', () => {
    params['id'] = newsSectionId;
    return hasuraGetSectionById(params).then(response => {
      expect(response.data).toHaveProperty('organization_locales');
      expect(response.data).toHaveProperty('categories_by_pk');
    });
  });

  it('lists all sections by locale', () => {
    params['localeCode'] = 'en-US';
    return hasuraListAllSectionsByLocale(params).then(response => {
      expect(response.data).toHaveProperty(['categories', 0, 'id']);
      expect(response.data).toHaveProperty(['categories', 0, 'slug']);
      expect(response.data).toHaveProperty(['categories', 0, 'published']);
      expect(response.data).toHaveProperty(['categories', 0, 'category_translations']);
    })
  });

  it('lists all sections', () => {
    return hasuraListAllSections(params).then(response => {
      expect(response.data).toHaveProperty('categories');
      expect(response.data.categories[0]).toHaveProperty('slug');
      expect(response.data.categories[0]).toHaveProperty('category_translations');
    });
  });

  // it('gets data required to render the section page for News', () => {
  //   params['localeCode'] = 'en-US';
  //   params['categorySlug'] = 'news';
  //   return hasuraCategoryPage(params).then(response => {
  //     expect(response.data).toHaveProperty('articles');
  //     expect(response.data).toHaveProperty('categories');
  //     expect(response.data.categories[0]).toHaveProperty('slug');
  //     expect(response.data.categories[0]).toHaveProperty('category_translations');
  //   });
  // });
});

describe('tags', () => {
  it('creates a tag', () => {
    params['localeCode'] = 'en-US';
    params['title'] = 'Tag News';
    params['published'] = true;
    params['slug'] = 'tag-news';

    return hasuraCreateTag(params).then(response => {
      newTagId = response.data.insert_tags_one.id;
      expect(response.data).toHaveProperty('insert_tags_one.id');
      expect(response.data).toHaveProperty('insert_tags_one.slug');
      expect(response.data).toHaveProperty('insert_tags_one.tag_translations');
    });
  });

  it('gets all tags', () => {
    return hasuraListAllTags(params).then(response => {
      expect(response.data).toHaveProperty('tags');
      expect(response.data.tags[0]).toHaveProperty('id');
      expect(response.data.tags[0]).toHaveProperty('slug');
      expect(response.data.tags[0]).toHaveProperty('tag_translations');
    });
  });

  it('gets tag page data', () => {
    params['localeCode'] = 'en-US';
    params['tagSlug'] = 'pandemic';
    return hasuraTagPage(params).then(response => {
      expect(response.data).toHaveProperty('tags');
      expect(response.data).toHaveProperty('site_metadatas');
      expect(response.data).toHaveProperty('categories');
    });
  });

  it('gets a tag by ID', () => {
    params['id'] = newTagId;
    return hasuraGetTagById(params).then(response => {
      expect(response.data).toHaveProperty('organization_locales');
      expect(response.data).toHaveProperty('tags_by_pk');
    });
  });

  it('updates a tag title', () => {
    params['id'] = newTagId;
    params['localeCode'] = 'en-US';
    params['title'] = 'New Tag News';
    params['published'] = true;
    params['slug'] = 'news';

    return hasuraUpdateTag(params).then(response => {
      expect(response.data).toHaveProperty('insert_tag_translations');
      expect(response.data).toHaveProperty('update_tags_by_pk');
    });
  });

});