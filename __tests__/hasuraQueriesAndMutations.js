import { hasuraGetSectionById, hasuraGetTagById, hasuraCreateTag, hasuraCreateSection, hasuraListAllSectionsByLocale, hasuraUpdateSection, hasuraUpdateTag } from '../lib/section';
import { hasuraListAllTags, hasuraListAllSections, hasuraAuthorPage, hasuraTagPage, hasuraCategoryPage, hasuraListAllAuthorPaths } from '../lib/articles';
import { hasuraCreateAuthor, hasuraGetAuthorById, hasuraGetAuthorBySlug, hasuraListAllAuthors } from '../lib/authors';

require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const apiToken = "oaklyn";

let params = {
  url: apiUrl,
  orgSlug: apiToken
};

let newAuthorId;
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

  it('gets data required to render the section page for News', () => {
    params['localeCode'] = 'en-US';
    params['categorySlug'] = 'news';
    return hasuraCategoryPage(params).then(response => {
      expect(response.data).toHaveProperty('articles');
      expect(response.data).toHaveProperty('categories');
      expect(response.data.categories[0]).toHaveProperty('slug');
      expect(response.data.categories[0]).toHaveProperty('category_translations');
    });
  });
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

describe('authors', () => {
  it('creates an author', () => {
    params['localeCode'] = 'en-US';
    params['title'] = 'Editor';
    params['published'] = true;
    params['staff'] = true;
    params['slug'] = 'test-author';
    params['name'] = 'Test Author';
    params['twitter'] = '@author';
    params['bio'] = 'This is a test author biography.';

    return hasuraCreateAuthor(params).then(response => {
      newAuthorId = response.data.insert_authors_one.id;
      expect(response.data).toHaveProperty('insert_authors_one.id');
      expect(response.data).toHaveProperty('insert_authors_one.slug');
      expect(response.data).toHaveProperty('insert_authors_one.name');
    });
  });

  it('gets data for rendering an author page', () => {
    params['localeCode'] = 'en-US';
    params['authorSlug'] = 'test-author';
    return hasuraAuthorPage(params).then(response => {
      expect(response.data).toHaveProperty('authors');
      expect(response.data.authors).toHaveLength(1);
      expect(response.data.authors[0]).toHaveProperty('slug');
      expect(response.data).toHaveProperty('articles');
      expect(response.data).toHaveProperty('categories');
      expect(response.data).toHaveProperty('site_metadatas');
    });
  });

  it('lists all author paths', () => {
    return hasuraListAllAuthorPaths(params).then(response => {
      expect(response.data).toHaveProperty('authors');
      expect(response.data.authors[0]).toHaveProperty('author_translations');
      expect(response.data.authors[0]).toHaveProperty('slug');
    });
  });

  it('lists authors', () => {
    params['localCode'] = 'en-US';
    return hasuraListAllAuthors(params['localeCode']).then(response => {
      expect(response.data).toHaveProperty('organization_locales');
      expect(response.data).toHaveProperty('authors');
    });
  });
  it('gets author by slug', () => {
    params['slug'] = 'test-author';
    return hasuraGetAuthorBySlug(params).then(response => {
      expect(response.data).toHaveProperty('authors');
      expect(response.data.authors[0]).toHaveProperty('id');
      expect(response.data.authors[0]).toHaveProperty('name');
      expect(response.data.authors[0]).toHaveProperty('photoUrl');
      expect(response.data.authors[0]).toHaveProperty('slug');
      expect(response.data.authors[0]).toHaveProperty('staff');
      expect(response.data.authors[0]).toHaveProperty('twitter');
    });
  });
  it('gets author by id', () => {
    params['id'] = newAuthorId;
    return hasuraGetAuthorById(params).then(response => {
      expect(response.data).toHaveProperty('authors_by_pk');
      expect(response.data.authors_by_pk).toHaveProperty('id');
      expect(response.data.authors_by_pk).toHaveProperty('name');
      expect(response.data.authors_by_pk).toHaveProperty('photoUrl');
      expect(response.data.authors_by_pk).toHaveProperty('slug');
      expect(response.data.authors_by_pk).toHaveProperty('staff');
      expect(response.data.authors_by_pk).toHaveProperty('twitter');
    });
  });
});