import { hasuraGetSectionById, hasuraGetTagById, hasuraCreateTag, hasuraCreateSection, hasuraListAllSectionsByLocale, hasuraUpdateSection, hasuraUpdateTag } from '../lib/section';
import { hasuraGetMetadataByLocale, hasuraListLocales, hasuraListAllTags, hasuraListAllSections, hasuraAuthorPage, hasuraTagPage, hasuraCategoryPage, hasuraListAllAuthorPaths } from '../lib/articles';
import { hasuraCreateAuthor, hasuraGetAuthorById, hasuraGetAuthorBySlug, hasuraListAllAuthors } from '../lib/authors';
import { hasuraUpsertMetadata } from '../lib/site_metadata';

const shared = require("../script/shared");

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
let testOrganization;

describe('organizations', () => {
  params['adminSecret'] = process.env.HASURA_ADMIN_SECRET;

  it('lists organizations', () => {
    return shared.hasuraListOrganizations(params).then(response => {
      expect(response.data).toHaveProperty('organizations');
      expect(response.data.organizations[0]).toHaveProperty('name');
      expect(response.data.organizations[0]).toHaveProperty('slug');
      expect(response.data.organizations[0]).toHaveProperty('organization_locales');
      testOrganization = response.data.organizations[0];
    });
  });

  it('lists all locales', () => {
    return shared.hasuraListAllLocales(params).then(response => {
      expect(response.data).toHaveProperty('locales');
      expect(response.data.locales[0]).toHaveProperty('code');
      expect(response.data.locales[0]).toHaveProperty('name');
    });
  });

  it('lists locales for an org', () => {
    params['orgSlug'] = testOrganization.slug;
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
});

describe('metadata', () => {

  it('gets site metadata by locale', () => {
    params['localeCode'] = 'en-US';
    return hasuraGetMetadataByLocale(params).then(response => {
      expect(response.data).toHaveProperty('organization_locales');
      expect(response.data).toHaveProperty('site_metadatas');
    });
  });

  it ('updates site metadata', () => {
    params['localeCode'] = 'en-US';
    params['published'] = false;
    params['data'] = {
      nav: '{"articles":"Articles","topics":"All Topics","cms":"tinycms"}',
      logo: 'https://tnc-test-upload-bucket.s3.us-east-1.amazonaws.com/oaklyn/logos/The Oaklyn Observer.jpeg',
      color: 'colortwo',
      theme: 'stylefour',
      labels: '{"latestNews":"Latest News","search":"Search","topics":"Topics"}',
      siteUrl: 'https://tinynewsco.org/',
      aboutCTA: 'Learn more',
      aboutDek: 'We’re journalists for Oaklyn. We amplify community voices, share information resources, and investigate systems, not just symptoms.',
      aboutHed: 'Who We Are',
      bodyFont: 'Mulish',
      shortName: 'The Oaklyn Observer',
      subscribe: '{"title":"Subscribe","subtitle":"Get the latest news from Oaklyn in your inbox."}',
      supportCTA: 'Donate',
      supportDek: 'The Oaklyn Observer exists based on the support of our readers. Chip in today to help us continue serving Oaklyn with quality journalism.',
      supportHed: 'Support our work',
      supportURL: 'https://tiny-news-collective.monkeypod.io/give/support-the-oaklyn-observer?secret=84fc2987ea6e8f11b8f4f8aca8b749d7',
      footerTitle: 'tinynewsco.org',
      headingFont: 'Arbutus Slab',
      landingPage: false,
      searchTitle: 'The Oaklyn Observer',
      primaryColor: '#de7a00',
      twitterTitle: 'Twitter title',
      facebookTitle: 'Facebook title',
      homepageTitle: 'The New Oaklyn Observer',
      membershipDek: 'Support great journalism by becoming a member for a low monthly price.',
      membershipHed: 'Become a member',
      newsletterDek: 'Get the latest headlines from The Oaklyn Observer right in your inbox. This is updated.',
      newsletterHed: 'Sign up for our newsletter',
      donateBlockDek: 'Support our local journalism with a monthly pledge.',
      donateBlockHed: 'Donate',
      secondaryColor: '#002c57',
      donationOptions: '[{\n' +
        '"uuid": "92f77857-eea6-4035-ae86-e9781e2627b2",\n' +
        '"amount": 5,\n' +
        '"name": "Member"\n' +
        '},\n' +
        '{\n' +
        '"uuid": "92f778a9-3187-4fe5-9d6b-a3041f126456",\n' +
        '"amount": 10,\n' +
        '"name": "Supporter"\n' +
        '},\n' +
        '{\n' +
        '"uuid": "92f77888-d1cc-4491-8080-780f0b109320",\n' +
        '"amount": 20,\n' +
        '"name": "Superuser"\n' +
        '}]',
      footerBylineLink: 'https://newscatalyst.org',
      footerBylineName: 'News Catalyst',
      homepageSubtitle: 'a new local news initiative',
      searchDescription: 'Page description',
      twitterDescription: 'Twitter description',
      facebookDescription: 'Facebook description'
    };
    
    return hasuraUpsertMetadata(params).then(response => {
      console.log(response.data);
      expect(response.data).toHaveProperty('insert_site_metadatas');
      expect(response.data.insert_site_metadatas).toHaveProperty('returning');
      expect(response.data.insert_site_metadatas.returning[0]).toHaveProperty('published');
      expect(response.data.insert_site_metadatas.returning[0].published).toBe(false);
    });
  })
});

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