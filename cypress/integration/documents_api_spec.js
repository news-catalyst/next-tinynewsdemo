let articleID;
let categoryID;
let pageID;
const faker = require('faker');

describe('document API', () => {
  before(() => {
    cy.log('before tests, setting up data...');
    cy.task('db:seed');
  });

  it('finds an article', () => {
    cy.wait(1000);
    cy.request({
      url: `/api/sidebar/documents/1LSyMzR1KxyKoml6q56DYQaxEV8Qm4EZo2y_xEFIkvGw?token=${Cypress.env(
        'apiToken'
      )}`,
    }).should((response) => {
      // should determine if this is an article or a page
      expect(response.body).to.have.property('documentType', 'article');

      // should return site-wide data for the sidebar form select menus
      expect(response.body.authors).to.have.length.of.at.least(1);
      expect(response.body.categories).to.have.length.of.at.least(1);
      expect(response.body.organization_locales).to.have.length.of.at.least(1);
      expect(response.body.tags).to.have.length.of.at.least(0);
      expect(response.body.homepage_layout_datas).to.have.length.of.at.least(0);
      expect(response.body.editorUrl).not.to.be.empty;

      // should return article-specific data
      // expect(response.body.article).to.be.instanceOf(Object);
      expect(response.body.article).not.to.be.empty;
      expect(response.body.article).to.have.property(
        'slug',
        'test-doc-for-article-features'
      );

      articleID = response.body.article.id;
      expect(response.body.article.category).to.have.property('slug', 'news');
      categoryID = response.body.article.category.id;
      expect(response.body.article.author_articles).not.to.be.empty;
      expect(response.body.article.tag_articles).to.have.length(1);
      expect(response.body.article.article_translations).to.have.length(1);
      expect(response.body.article.article_translations[0]).to.have.any.keys(
        'headline',
        'id',
        'published',
        'search_title',
        'search_description'
      );
    });
  });

  it('finds a page', () => {
    cy.wait(1000);
    cy.request({
      url: `/api/sidebar/documents/1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU?token=${Cypress.env(
        'apiToken'
      )}`,
    }).should((response) => {
      // should determine if this is an article or a page
      expect(response.body).to.have.property('documentType', 'page');

      //     // should return site-wide data for the sidebar form select menus
      expect(response.body.authors).to.have.length.of.at.least(1);
      expect(response.body.categories).to.have.length.of.at.least(1);
      expect(response.body.organization_locales).to.have.length.of.at.least(1);
      expect(response.body.tags).to.have.length.of.at.least(1);
      expect(response.body.page_google_documents).to.have.length.of.at.least(1);
      expect(response.body.editorUrl).not.to.be.empty;

      expect(response.body.page).not.to.be.empty;
      expect(response.body.page).to.have.property('slug', 'test-about-page');
      pageID = response.body.page.id;
      expect(response.body.page.page_translations).to.have.length(1);
      expect(response.body.page.page_translations[0]).to.have.any.keys(
        'headline',
        'id',
        'published',
        'search_title',
        'search_description',
        'locale_code'
      );
    });
  });

  it('responds with sitewide data for an unknown (new) document', () => {
    cy.wait(5000);
    cy.request({
      url: `/api/sidebar/documents/123456abcnotfound?token=${Cypress.env(
        'apiToken'
      )}`,
    }).should((response) => {
      // should determine if this is an article or a page
      expect(response.body.documentType).to.be.null;

      // should return site-wide data for the sidebar form select menus
      expect(response.body.authors).to.have.length.of.at.least(1);
      expect(response.body.categories).to.have.length.of.at.least(1);
      expect(response.body.organization_locales).to.have.length.of.at.least(1);
      expect(response.body.tags).to.have.length.of.at.least(1);
      expect(response.body.editorUrl).not.to.be.empty;

      expect(response.body.article).to.be.undefined;
      expect(response.body.page).to.be.undefined;
    });
  });

  it('previews an article', () => {
    cy.wait(5000);
    let articleData = {
      id: articleID,
      slug: 'test-doc-for-article-features',
      category_id: categoryID,
      article_sources: [],
      document_id: '1LSyMzR1KxyKoml6q56DYQaxEV8Qm4EZo2y_xEFIkvGw',
      locale_code: 'en-US',
      headline: faker.lorem.sentence(),
      published: false,
      search_description: faker.lorem.paragraph(),
      search_title: faker.lorem.sentence(),
      twitter_title: faker.lorem.sentence(),
      twitter_description: faker.lorem.paragraph(),
      facebook_title: faker.lorem.sentence(),
      facebook_description: faker.lorem.paragraph(),
    };
    cy.request(
      'POST',
      `/api/sidebar/documents/1LSyMzR1KxyKoml6q56DYQaxEV8Qm4EZo2y_xEFIkvGw/preview?documentType=article&token=${Cypress.env(
        'apiToken'
      )}`,
      {
        articleData: articleData,
        contents: [
          {
            paragraph: {
              elements: [
                {
                  textRun: {
                    content: faker.lorem.sentence(),
                    textStyle: {},
                  },
                  startIndex: 1,
                  endIndex: 22,
                },
              ],
              paragraphStyle: {
                namedStyleType: 'HEADING_1',
                direction: 'LEFT_TO_RIGHT',
                headingId: 'h.3rjhe4n2n39e',
              },
            },
            endIndex: 22,
            startIndex: 1,
          },
        ],
        slug: 'test-doc-for-article-features',
        googleAuthToken: faker.lorem.word(),
      }
    ).then((response) => {
      expect(response.body).to.have.property('documentType', 'article');
      expect(response.body).to.have.property('status', 'success');
    });
  });

  it('publishes an article', () => {
    cy.wait(2000);
    let articleData = {
      id: articleID,
      slug: 'test-doc-for-article-features',
      category_id: categoryID,
      article_sources: [],
      document_id: '1LSyMzR1KxyKoml6q56DYQaxEV8Qm4EZo2y_xEFIkvGw',
      locale_code: 'en-US',
      headline: faker.lorem.sentence(),
      published: true,
      search_description: faker.lorem.paragraph(),
      search_title: faker.lorem.sentence(),
      twitter_title: faker.lorem.sentence(),
      twitter_description: faker.lorem.paragraph(),
      facebook_title: faker.lorem.sentence(),
      facebook_description: faker.lorem.paragraph(),
    };
    cy.request(
      'POST',
      `/api/sidebar/documents/1LSyMzR1KxyKoml6q56DYQaxEV8Qm4EZo2y_xEFIkvGw/publish?documentType=article&token=${Cypress.env(
        'apiToken'
      )}`,
      {
        articleData: articleData,
        contents: [
          {
            paragraph: {
              elements: [
                {
                  textRun: {
                    content: faker.lorem.sentence(),
                    textStyle: {},
                  },
                  startIndex: 1,
                  endIndex: 22,
                },
              ],
              paragraphStyle: {
                namedStyleType: 'HEADING_1',
                direction: 'LEFT_TO_RIGHT',
                headingId: 'h.3rjhe4n2n39e',
              },
            },
            endIndex: 22,
            startIndex: 1,
          },
        ],
        slug: 'test-doc-for-article-features',
        googleAuthToken: faker.lorem.word(),
      }
    ).then((response) => {
      expect(response.body).to.have.property('documentType', 'article');
      expect(response.body).to.have.property('status', 'success');
    });
  });

  it('unpublishes an article', () => {
    cy.wait(2000);

    cy.request({
      url: `/api/sidebar/documents/1LSyMzR1KxyKoml6q56DYQaxEV8Qm4EZo2y_xEFIkvGw/unpublish?documentType=article&token=${Cypress.env(
        'apiToken'
      )}`,
    }).then((response) => {
      expect(response.body).to.have.property('documentType', 'article');
      expect(response.body).to.have.property('status', 'success');
    });
  });
  it('previews a page', () => {
    cy.wait(2000);
    let pageData = {
      id: pageID,
      slug: 'test-about-page',
      document_id: '1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU',
      locale_code: 'en-US',
      headline: faker.lorem.sentence(),
      published: false,
      search_description: faker.lorem.paragraph(),
      search_title: faker.lorem.sentence(),
      twitter_title: faker.lorem.sentence(),
      twitter_description: faker.lorem.paragraph(),
      facebook_title: faker.lorem.sentence(),
      facebook_description: faker.lorem.paragraph(),
    };
    cy.request(
      'POST',
      `/api/sidebar/documents/1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU/preview?documentType=page&token=${Cypress.env(
        'apiToken'
      )}`,
      {
        pageData: pageData,
        contents: [
          {
            paragraph: {
              elements: [
                {
                  textRun: {
                    content: faker.lorem.sentence(),
                    textStyle: {},
                  },
                  startIndex: 1,
                  endIndex: 22,
                },
              ],
              paragraphStyle: {
                namedStyleType: 'HEADING_1',
                direction: 'LEFT_TO_RIGHT',
                headingId: 'h.3rjhe4n2n39e',
              },
            },
            endIndex: 22,
            startIndex: 1,
          },
        ],
        slug: 'test-about-page',
        googleAuthToken: faker.lorem.word(),
      }
    ).then((response) => {
      expect(response.body).to.have.property('documentType', 'page');
      expect(response.body).to.have.property('status', 'success');
    });
  });

  it('publishes a page', () => {
    cy.wait(5000);
    let pageData = {
      id: pageID,
      slug: 'test-about-page',
      document_id: '1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU',
      locale_code: 'en-US',
      headline: faker.lorem.sentence(),
      published: true,
      search_description: faker.lorem.paragraph(),
      search_title: faker.lorem.sentence(),
      twitter_title: faker.lorem.sentence(),
      twitter_description: faker.lorem.paragraph(),
      facebook_title: faker.lorem.sentence(),
      facebook_description: faker.lorem.paragraph(),
    };
    cy.request(
      'POST',
      `/api/sidebar/documents/1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU/publish?documentType=page&token=${Cypress.env(
        'apiToken'
      )}`,
      {
        pageData: pageData,
        contents: [
          {
            paragraph: {
              elements: [
                {
                  textRun: {
                    content: faker.lorem.sentence(),
                    textStyle: {},
                  },
                  startIndex: 1,
                  endIndex: 22,
                },
              ],
              paragraphStyle: {
                namedStyleType: 'HEADING_1',
                direction: 'LEFT_TO_RIGHT',
                headingId: 'h.3rjhe4n2n39e',
              },
            },
            endIndex: 22,
            startIndex: 1,
          },
        ],
        slug: 'test-about-page',
        googleAuthToken: faker.lorem.word(),
      }
    ).then((response) => {
      expect(response.body).to.have.property('documentType', 'page');
      expect(response.body).to.have.property('status', 'success');
    });
  });

  it('unpublishes a page', () => {
    cy.wait(5000);

    cy.request({
      url: `/api/sidebar/documents/1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU/unpublish?documentType=page&token=${Cypress.env(
        'apiToken'
      )}`,
    }).then((response) => {
      expect(response.body).to.have.property('documentType', 'page');
      expect(response.body).to.have.property('status', 'success');
    });
  });
});
