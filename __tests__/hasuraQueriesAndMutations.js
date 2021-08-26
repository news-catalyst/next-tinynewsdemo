import { hasuraGetSectionById, hasuraGetTagById, hasuraCreateTag, hasuraCreateSection, hasuraListAllSectionsByLocale, hasuraUpdateSection, hasuraUpdateTag } from '../lib/section';
import { hasuraGetHomepageEditor, hasuraCreatePage, hasuraSearchArticles, hasuraArticlePage, hasuraPreviewArticlePage, hasuraPreviewArticleBySlug, hasuraGetArticleBySlug, hasuraListAllArticleSlugs, hasuraGetMetadataByLocale, hasuraListAllTags, hasuraListAllSections, hasuraAuthorPage, hasuraTagPage, hasuraCategoryPage, hasuraCreateArticle, hasuraUpdateArticle, hasuraDeleteArticles } from '../lib/articles';
import { hasuraCreateAuthor, hasuraGetAuthorById, hasuraGetAuthorBySlug, hasuraListAllAuthors } from '../lib/authors';
import { hasuraUpsertMetadata } from '../lib/site_metadata';

let newAuthorId = 12;
let newsSectionId;
let newTagId;

// otherwise all queries and mutations are built on the organization's access
let orgParams = {
  url: "https://tinynews-testing.hasura.app/v1/graphql",
  orgSlug: "test-org"
}

describe('metadata', () => {
  it('gets site metadata by locale', () => {
      let metadataParams = Object.assign({}, orgParams); 
      metadataParams['localeCode'] = 'en-US';
      return hasuraGetMetadataByLocale(metadataParams).then(response => {
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('organization_locales');
        expect(response.data).toHaveProperty('site_metadatas');
      });

  });

  it('updates site metadata', () => {
      let metadataParams = Object.assign({}, orgParams); 
      metadataParams['localeCode'] = 'en-US';
      metadataParams['published'] = false;
      metadataParams['data'] = {
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
    
      return hasuraUpsertMetadata(metadataParams).then(response => {
        console.log(JSON.stringify(response))
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('insert_site_metadatas');
        expect(response.data.insert_site_metadatas).toHaveProperty('returning');
        expect(response.data.insert_site_metadatas.returning[0]).toHaveProperty('published');
        expect(response.data.insert_site_metadatas.returning[0].published).toBe(false);
      });

  })
});

describe('sections', () => {
  it('creates a section', () => {
      let sectionParams = Object.assign({}, orgParams); 
      sectionParams['localeCode'] = 'en-US';
      sectionParams['title'] = 'News';
      sectionParams['published'] = true;
      sectionParams['slug'] = 'news';

      return hasuraCreateSection(sectionParams).then(response => {
        newsSectionId = response.data.insert_categories_one.id;
        expect(response.data).toHaveProperty('insert_categories_one.id');
        expect(response.data).toHaveProperty('insert_categories_one.slug');
        expect(response.data).toHaveProperty('insert_categories_one.category_translations');
      });

  });

  it('updates a section title', () => {
      let sectionParams = Object.assign({}, orgParams); 
      sectionParams['id'] = newsSectionId;
      sectionParams['localeCode'] = 'en-US';
      sectionParams['title'] = 'Top Stories';
      sectionParams['published'] = true;
      sectionParams['slug'] = 'news';
      return hasuraUpdateSection(sectionParams).then(response => {
        expect(response.data).toHaveProperty('insert_category_translations');
        expect(response.data).toHaveProperty('update_categories_by_pk');
      });

  });

  it('gets a section by ID', () => {
      let sectionParams = Object.assign({}, orgParams); 
      sectionParams['id'] = newsSectionId;
      return hasuraGetSectionById(sectionParams).then(response => {
        expect(response.data).toHaveProperty('organization_locales');
        expect(response.data).toHaveProperty('categories_by_pk');
      });

  });

  it('lists all sections by locale', () => {
      let sectionParams = Object.assign({}, orgParams); 
      sectionParams['localeCode'] = 'en-US';
      return hasuraListAllSectionsByLocale(sectionParams).then(response => {
        expect(response.data).toHaveProperty(['categories', 0, 'id']);
        expect(response.data).toHaveProperty(['categories', 0, 'slug']);
        expect(response.data).toHaveProperty(['categories', 0, 'published']);
        expect(response.data).toHaveProperty(['categories', 0, 'category_translations']);
      })

  });

  it('lists all sections', () => {
      let sectionParams = Object.assign({}, orgParams); 
      return hasuraListAllSections(sectionParams).then(response => {
        expect(response.data).toHaveProperty('categories');
        expect(response.data.categories[0]).toHaveProperty('slug');
        expect(response.data.categories[0]).toHaveProperty('category_translations');
      });

  });

  it('gets data required to render a section page', () => {
      let sectionParams = Object.assign({}, orgParams); 
      sectionParams['localeCode'] = 'en-US';
      sectionParams['categorySlug'] = 'news';
      return hasuraCategoryPage(sectionParams).then(response => {
        expect(response.data).toHaveProperty('articles');
        expect(response.data).toHaveProperty('categories');
        expect(response.data.categories[0]).toHaveProperty('slug');
        expect(response.data.categories[0]).toHaveProperty('category_translations');
      });

  });
});

describe('tags', () => {
  it('creates a tag', () => {
      let tagParams = Object.assign({}, orgParams); 
      tagParams['localeCode'] = 'en-US';
      tagParams['title'] = 'Tag News';
      tagParams['published'] = true;
      tagParams['slug'] = 'tag-news';

      return hasuraCreateTag(tagParams).then(response => {
        newTagId = response.data.insert_tags_one.id;
        expect(response.data).toHaveProperty('insert_tags_one.id');
        expect(response.data).toHaveProperty('insert_tags_one.slug');
        expect(response.data).toHaveProperty('insert_tags_one.tag_translations');
      });

  });

  it('gets all tags', () => {
      let tagParams = Object.assign({}, orgParams); 
      return hasuraListAllTags(tagParams).then(response => {
        expect(response.data).toHaveProperty('tags');
        expect(response.data.tags[0]).toHaveProperty('id');
        expect(response.data.tags[0]).toHaveProperty('slug');
        expect(response.data.tags[0]).toHaveProperty('tag_translations');
      });

  });

  it('gets tag page data', () => {
      let tagParams = Object.assign({}, orgParams); 
      tagParams['localeCode'] = 'en-US';
      tagParams['tagSlug'] = 'tag-news';
      return hasuraTagPage(tagParams).then(response => {
        expect(response.data).toHaveProperty('tags');
        expect(response.data).toHaveProperty('site_metadatas');
        expect(response.data).toHaveProperty('categories');
      });

  });

  it('gets a tag by ID', () => {
      let tagParams = Object.assign({}, orgParams); 
      tagParams['id'] = newTagId;
      return hasuraGetTagById(tagParams).then(response => {
        expect(response.data).toHaveProperty('organization_locales');
        expect(response.data).toHaveProperty('tags_by_pk');
      });

  });

  it('updates a tag title', () => {
      let tagParams = Object.assign({}, orgParams); 
      tagParams['id'] = newTagId;
      tagParams['localeCode'] = 'en-US';
      tagParams['slug'] = 'news';
      tagParams['title'] = 'New Tag News';
      tagParams['published'] = true;

      return hasuraUpdateTag(tagParams).then(response => {
        expect(response.data).toHaveProperty('insert_tag_translations');
        expect(response.data).toHaveProperty('update_tags_by_pk');
      });

  });
});

describe('authors', () => {
  // this test keeps failing intermittently; commenting out until I figure out what the problem is
  // related:  https://hasura.io/docs/1.0/graphql/core/mutations/upsert.html#nested-upsert-caveats
  it('creates an author', () => {
    let authorParams = Object.assign({}, orgParams); 
    authorParams['localeCode'] = 'en-US';
    authorParams['authorSlug'] = 'test-author-created';
    authorParams['slug'] = 'test-author-created';
    authorParams['title'] = 'Editor';
    authorParams['published'] = true;
    authorParams['staff'] = true;
    authorParams['name'] = 'Test Author Created';
    authorParams['twitter'] = '@author';
    authorParams['bio'] = 'This is a test author biography.';
    authorParams['photoUrl'] = 'https://example.com/photo.jpg';

    return hasuraCreateAuthor(authorParams).then(response => {
      expect(response.data).toHaveProperty('insert_authors')
      expect(response.data.insert_authors).toHaveProperty('returning')
      newAuthorId = response.data.insert_authors.returning[0].id;
      expect(response.data.insert_authors.returning[0]).toHaveProperty('name')
      expect(response.data.insert_authors.returning[0]).toHaveProperty('slug')
    });
  });

  it('gets data for rendering an author page', () => {
      let authorParams = Object.assign({}, orgParams); 
      authorParams['localeCode'] = 'en-US';
      authorParams['authorSlug'] = 'test-author-created';
      return hasuraAuthorPage(authorParams).then(response => {
        expect(response.data).toHaveProperty('authors');
        expect(response.data.authors).toHaveLength(1);
        expect(response.data.authors[0]).toHaveProperty('slug');
        expect(response.data).toHaveProperty('articles');
        expect(response.data).toHaveProperty('categories');
        expect(response.data).toHaveProperty('site_metadatas');
      });

  });

  it('lists authors', () => {
      return hasuraListAllAuthors("en-US", orgParams).then(response => {
        // console.log("hasuraListAllAuthors:", response);
        expect(response.data).toHaveProperty('organization_locales');
        expect(response.data).toHaveProperty('authors');
      });

  });

  it('gets author by slug', () => {
      let authorParams = Object.assign({}, orgParams); 
      authorParams['slug'] = 'test-author-created';
      return hasuraGetAuthorBySlug(authorParams).then(response => {
        expect(response.data).toHaveProperty('authors');
      });
  });

  it('gets author by id', () => {
      let authorParams = Object.assign({}, orgParams); 
      authorParams['id'] = newAuthorId;
      return hasuraGetAuthorById(authorParams).then(response => {
        expect(response.data).toHaveProperty('authors_by_pk');
      });

  });
});

let articleId;
let enCategories = [];
let esCategories = [];

describe('articles', () => {
  beforeAll(async (done) => {
    const { errors, data } = await hasuraDeleteArticles(orgParams);
    if (errors) {
      console.error("errors deleting articles:", errors);
    }

    let enCategoryParams = Object.assign({}, orgParams); 
    enCategoryParams['localeCode'] = "en-US";
    let enResponse = await hasuraListAllSectionsByLocale(enCategoryParams);
    
    expect(enResponse.errors).toBeUndefined();
    enCategories = enResponse.data.categories;
    // console.log("english categories:", enCategories);

    let esCategoryParams = Object.assign({}, orgParams); 
    esCategoryParams['localeCode'] = "es";
    const esResponse = await hasuraListAllSectionsByLocale(esCategoryParams);
    expect(esResponse.errors).toBeUndefined();

    esCategories = esResponse.data.categories;
    // console.log("spanish categories:", esCategories);
    done();
  })
  // clean up articles to avoid errors building the testing site
  afterAll(async (done) => {
    const { errors, data } = await hasuraDeleteArticles(orgParams);
    expect(errors).toBeUndefined();

  })

  it('creates an unpublished article in US English', async () => {
    await new Promise((r) => setTimeout(r, 2000));

      let articleParams = Object.assign({}, orgParams); 
      articleParams['locale_code'] = 'en-US';
      articleParams['headline'] = 'Test Article 1 Headline';
      articleParams['published'] = false
      articleParams['slug'] = 'test-article-1';
      articleParams['content'] = '<p>Test article copy appears in this field.</p>';
      articleParams['search_title'] = 'Test Article 1 Search Title';
      articleParams['search_description'] = 'Test article 1 search description copy.';
      articleParams['document_id'] = '1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU';
      articleParams['created_by_email'] = 'jacqui@newscatalyst.org';
      articleParams['article_sources'] = [];
      if (enCategories && enCategories[0]) {
        articleParams['category_id'] = enCategories[0].id;
      } else {
        console.error("No english category to use: ", enCategories)
      }

      // console.log("hasuraCreateArticle params:", articleParams);
      return hasuraCreateArticle(articleParams).then(response => {
        // console.log("hasuraCreateArticle:", JSON.stringify(response));
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('insert_articles');
        expect(response.data.insert_articles).toHaveProperty('returning');
        expect(response.data.insert_articles.returning[0]).toHaveProperty('id');
        articleId = response.data.insert_articles.returning[0].id;
        expect(response.data.insert_articles.returning[0]).toHaveProperty('slug');
        expect(response.data.insert_articles.returning[0].slug).toEqual(articleParams['slug']);
        expect(response.data.insert_articles.returning[0]).toHaveProperty('article_translations');
        expect(response.data.insert_articles.returning[0]).toHaveProperty('category');
      });
  });

  it('adds a spanish translation to an article', async () => {
    await new Promise((r) => setTimeout(r, 2000));

    let articleParams = Object.assign({}, orgParams); 
    articleParams['locale_code'] = 'es';
    articleParams['headline'] = 'Test Article 1 spanish Headline';
    articleParams['published'] = true
    articleParams['slug'] = 'test-article-1';
    articleParams['id'] = articleId;
    articleParams['content'] = '<p>Test article spanish copy appears in this field.</p>';
    articleParams['search_title'] = 'Test Article 1 Spanish Search Title';
    articleParams['search_description'] = 'Test article 1 spanish search description copy.';
    articleParams['document_id'] = '1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU';
    articleParams['created_by_email'] = 'jacqui@newscatalyst.org';
    articleParams['article_sources'] = [];
    articleParams['category_id'] = esCategories[0].id;

    return hasuraUpdateArticle(articleParams).then(response => {
      // console.log("hasuraUpdateArticle:", JSON.stringify(response));
      expect(response.errors).toBeUndefined();
      expect(response.data).toHaveProperty('insert_articles');
      expect(response.data.insert_articles).toHaveProperty('returning');
      expect(response.data.insert_articles.returning[0]).toHaveProperty('id');
      articleId = response.data.insert_articles.returning[0].id;
      expect(response.data.insert_articles.returning[0]).toHaveProperty('slug');
      expect(response.data.insert_articles.returning[0].slug).toEqual(articleParams['slug']);
      expect(response.data.insert_articles.returning[0]).toHaveProperty('article_translations');
      expect(response.data.insert_articles.returning[0]).toHaveProperty('category');
    });
  });

  it('updates an article to published', async () => {
    await new Promise((r) => setTimeout(r, 2000));

      let articleParams = Object.assign({}, orgParams); 
      articleParams['locale_code'] = 'en-US';
      articleParams['headline'] = 'Test Article 1 Headline';
      articleParams['published'] = true;
      articleParams['id'] = articleId;
      articleParams['category_id'] = enCategories[0].id;;
      articleParams['slug'] = 'test-article-1';
      articleParams['content'] = '<p>Test article copy appears in this field.</p>';
      articleParams['search_title'] = 'Test Article 1 Search Title';
      articleParams['search_description'] = 'Test article 1 search description copy.';
      articleParams['document_id'] = '1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU';
      articleParams['created_by_email'] = 'jacqui@newscatalyst.org';
      articleParams['article_sources'] = [];

      return hasuraUpdateArticle(articleParams).then(response => {
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('insert_articles');
        expect(response.data.insert_articles).toHaveProperty('returning');
        expect(response.data.insert_articles.returning[0]).toHaveProperty('id');
        expect(response.data.insert_articles.returning[0]).toHaveProperty('slug');
        expect(response.data.insert_articles.returning[0].slug).toEqual(articleParams['slug']);
        expect(response.data.insert_articles.returning[0]).toHaveProperty('article_translations');
        expect(response.data.insert_articles.returning[0]).toHaveProperty('category');
        expect(response.data.insert_articles.returning[0].article_translations[0].published).toEqual(true);
      });

  });

  it('adds another article', async () => {
    await new Promise((r) => setTimeout(r, 2000));

    let articleParams = Object.assign({}, orgParams); 
    articleParams['locale_code'] = 'en-US';
    articleParams['headline'] = 'Test Article 2 Headline';
    articleParams['published'] = true;
    articleParams['category_id'] = enCategories[0].id;
    articleParams['slug'] = 'test-article-2';
    articleParams['content'] = '<p>Test article 2 copy appears in this field.</p>';
    articleParams['search_title'] = 'Test Article 2 Search Title';
    articleParams['search_description'] = 'Test article 2 search description copy.';
    articleParams['document_id'] = '1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A0123';
    articleParams['created_by_email'] = 'jacqui@newscatalyst.org';
    articleParams['article_sources'] = [];

    return hasuraCreateArticle(articleParams).then(response => {
      expect(response.errors).toBeUndefined();
      // console.log("adds another article response:", response);
      expect(response.data).toHaveProperty('insert_articles');
      expect(response.data.insert_articles).toHaveProperty('returning');
      // console.log(response.data.insert_articles.returning[0]);
      
      expect(response.data.insert_articles.returning[0]).toHaveProperty('id');
      expect(response.data.insert_articles.returning[0]).toHaveProperty('slug');
      expect(response.data.insert_articles.returning[0].slug).toEqual(articleParams['slug']);
      expect(response.data.insert_articles.returning[0]).toHaveProperty('article_translations');
      expect(response.data.insert_articles.returning[0]).toHaveProperty('category');
      expect(response.data.insert_articles.returning[0].article_translations[0].published).toEqual(true);
    });
});

  it('lists all published page slugs', async () => {
    await new Promise((r) => setTimeout(r, 2000));

      let articleParams = Object.assign({}, orgParams); 
      return hasuraListAllArticleSlugs(articleParams).then(response => {
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('articles');
        expect(response.data.articles[0]).toHaveProperty('article_translations');
        expect(response.data.articles[0]).toHaveProperty('slug');
        expect(response.data.articles[0]).toHaveProperty('category');
      });

  });

  it('searches articles', async () => {
    await new Promise((r) => setTimeout(r, 2000));

    let articleParams = Object.assign({}, orgParams); 
    articleParams['localeCode'] = 'en-US';
    articleParams['term'] = 'Test Article';

      return hasuraSearchArticles(articleParams).then(response => {
        expect(response.errors).toBeUndefined();
        // console.log("hasuraSearchArticles:", response)
        expect(response.data).toHaveProperty('articles');
        expect(response.data.articles[0]).toHaveProperty('id');
        expect(response.data.articles[0]).toHaveProperty('article_translations');
        expect(response.data.articles[0]).toHaveProperty('category');
        expect(response.data.articles[0]).toHaveProperty('slug');
        expect(response.data.articles[0]).toHaveProperty('author_articles');
        expect(response.data.articles[0]).toHaveProperty('tag_articles');
      });

  });

  it('gets data for article page', async () => {
    await new Promise((r) => setTimeout(r, 2000));

      let articleParams = Object.assign({}, orgParams); 
      articleParams['localeCode'] = 'en-US';
      articleParams['slug'] = 'test-article-1';
      articleParams['categorySlug'] = 'news';
      return hasuraArticlePage(articleParams).then(response => {
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('article_slug_versions');
        expect(response.data).toHaveProperty('categories');
        expect(response.data).toHaveProperty('tags');
        expect(response.data).toHaveProperty('site_metadatas');
      });

  });

  it('gets data for previewing an article page in english', async () => {
    await new Promise((r) => setTimeout(r, 2000));

      let articleParams = Object.assign({}, orgParams); 
      articleParams['localeCode'] = 'en-US';
      articleParams['slug'] = 'test-article-1';
      articleParams['categorySlug'] = 'news';
      return hasuraPreviewArticlePage(articleParams).then(response => {
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('articles');
        expect(response.data).toHaveProperty('categories');
        expect(response.data).toHaveProperty('tags');
        expect(response.data).toHaveProperty('site_metadatas');

        let articlesData = response.data.articles;
        let articleData = articlesData[0];
        expect(response.data.articles[0]).toHaveProperty('slug');
        expect(response.data.articles[0]).toHaveProperty('article_translations');
        let translation = articleData.article_translations[0];
        expect(translation.locale_code).toEqual("en-US");
        expect(translation.headline).toEqual("Test Article 1 Headline");
        expect(response.data.articles[0]).toHaveProperty('category');
        expect(response.data.articles[0]).toHaveProperty('author_articles');
      });

  });

  it('gets data for previewing an article page in spanish', async () => {
    await new Promise((r) => setTimeout(r, 2000));

    let articleParams = Object.assign({}, orgParams); 
    articleParams['localeCode'] = 'es';
    articleParams['slug'] = 'test-article-1';
    articleParams['categorySlug'] = 'news';
    return hasuraPreviewArticlePage(articleParams).then(response => {
      expect(response.errors).toBeUndefined();
      expect(response.data).toHaveProperty('articles');
      expect(response.data).toHaveProperty('categories');
      expect(response.data).toHaveProperty('tags');
      expect(response.data).toHaveProperty('site_metadatas');

      let articlesData = response.data.articles;
      // console.log("articlesData:", articlesData);
      let articleData = articlesData[0];
      // console.log("article data:", articleData);
      expect(response.data.articles[0]).toHaveProperty('slug');
      expect(response.data.articles[0]).toHaveProperty('article_translations');
      let translation = articleData.article_translations[0];
      expect(translation.locale_code).toEqual("es");
      expect(translation.headline).toEqual("Test Article 1 spanish Headline");
      expect(response.data.articles[0]).toHaveProperty('category');
      expect(response.data.articles[0]).toHaveProperty('author_articles');
    });

});

  it('gets data to preview an article by slug', async () => {
    await new Promise((r) => setTimeout(r, 2000));

      let articleParams = Object.assign({}, orgParams); 
      articleParams['localeCode'] = 'en-US';
      articleParams['slug'] = 'test-article-1';
      return hasuraPreviewArticleBySlug(articleParams).then(response => {
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('articles');
        expect(response.data.articles).toHaveLength(1);
        expect(response.data.articles[0]).toHaveProperty('slug');
        expect(response.data.articles[0]).toHaveProperty('article_translations');
        expect(response.data.articles[0]).toHaveProperty('category');
        expect(response.data.articles[0]).toHaveProperty('author_articles');
      });

  });

  it('gets data for an article by slug', async () => {
    await new Promise((r) => setTimeout(r, 2000));

      let articleParams = Object.assign({}, orgParams); 
      articleParams['localeCode'] = 'en-US';
      articleParams['slug'] = 'test-article-1';
      return hasuraGetArticleBySlug(articleParams).then(response => {
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('articles');
        expect(response.data.articles).toHaveLength(1);
        expect(response.data.articles[0]).toHaveProperty('slug');
        expect(response.data.articles[0]).toHaveProperty('article_translations');
        expect(response.data.articles[0]).toHaveProperty('category');
        expect(response.data.articles[0]).toHaveProperty('author_articles');
      });

  });

  it('gets data (by slug) for the same article in spanish', async () => {
    await new Promise((r) => setTimeout(r, 2000));
    let articleParams = Object.assign({}, orgParams); 
    articleParams['localeCode'] = 'es';
    articleParams['slug'] = 'test-article-1';
    return hasuraGetArticleBySlug(articleParams).then(response => {
      expect(response.errors).toBeUndefined();
      expect(response.data).toHaveProperty('articles');
      expect(response.data.articles).toHaveLength(1);

      let articleData = response.data.articles[0];
      expect(articleData).toHaveProperty('slug');
      expect(articleData).toHaveProperty('article_translations');
      expect(articleData).toHaveProperty('slug');
      expect(articleData).toHaveProperty('article_translations');
      expect(articleData).toHaveProperty('category');
      expect(articleData).toHaveProperty('author_articles');
      let translation = articleData.article_translations[0];
      expect(translation.headline).toEqual("Test Article 1 spanish Headline");
    });

});
});

describe('pages', () => {
  it('creates an unpublished page', async () => {
    await new Promise((r) => setTimeout(r, 2000));

      let pageParams = Object.assign({}, orgParams); 
      pageParams['locale_code'] = 'en-US';
      pageParams['headline'] = 'Test Page 1 Headline';
      pageParams['published'] = false
      pageParams['slug'] = 'test-page-1';
      pageParams['content'] = '<p>Test page copy appears in this field.</p>';
      pageParams['search_title'] = 'Test Page 1 Search Title';
      pageParams['search_description'] = 'Test page 1 search description copy.';
      pageParams['document_id'] = '1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU';
      pageParams['created_by_email'] = 'jacqui@newscatalyst.org';

      return hasuraCreatePage(pageParams).then(response => {
        expect(response.errors).toBeUndefined();
        expect(response.data).toHaveProperty('insert_pages');
        expect(response.data.insert_pages).toHaveProperty('returning');
        expect(response.data.insert_pages.returning[0]).toHaveProperty('id');
        expect(response.data.insert_pages.returning[0]).toHaveProperty('slug');
        expect(response.data.insert_pages.returning[0].slug).toEqual(pageParams['slug']);
      });

  });

  it('updates a page', async () => {
    await new Promise((r) => setTimeout(r, 2000));

      let pageParams = Object.assign({}, orgParams); 
      pageParams['locale_code'] = 'en-US';
      pageParams['published'] = true;
      pageParams['slug'] = 'test-page-1';
      pageParams['headline'] = 'Test Page 1 Headline';
      pageParams['content'] = '<p>Test page copy appears in this field.</p>';
      pageParams['search_title'] = 'Test Page 1 Search Title';
      pageParams['search_description'] = 'Test page 1 search description copy.';
      pageParams['document_id'] = '1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU';
      pageParams['created_by_email'] = 'jacqui@newscatalyst.org';

      return hasuraCreatePage(pageParams).then(response => {
        expect(response.data).toHaveProperty('insert_pages');
        expect(response.data.insert_pages).toHaveProperty('returning');
        expect(response.data.insert_pages.returning[0]).toHaveProperty('id');
        expect(response.data.insert_pages.returning[0]).toHaveProperty('slug');
        expect(response.data.insert_pages.returning[0].slug).toEqual(pageParams['slug']);
        expect(response.data.insert_pages.returning[0]).toHaveProperty('page_translations');
        expect(response.data.insert_pages.returning[0].page_translations[0]).toHaveProperty('published');
        expect(response.data.insert_pages.returning[0].page_translations[0].published).toEqual(true);
      });
  });
});

describe('homepage', () => {
  it('gets data for homepage editor', async () => {
    await new Promise((r) => setTimeout(r, 2000));

    let hpParams = Object.assign({}, orgParams); 
    hpParams['localeCode'] = 'en-US';

    return hasuraGetHomepageEditor(hpParams).then(response => {
      expect(response.data).toHaveProperty('homepage_layout_schemas');
      expect(response.data).toHaveProperty('homepage_layout_datas');
      expect(response.data).toHaveProperty('categories');
      expect(response.data).toHaveProperty('site_metadatas');
      expect(response.data).toHaveProperty('tags');
    });
  });
});