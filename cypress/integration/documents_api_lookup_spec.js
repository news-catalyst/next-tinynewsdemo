describe('document API', () => {
  before(() => {
    cy.log('before tests, setting up data...');
    cy.task('db:seed');
    // cy.fixture('organization').as('usersJson') // load data from users.json
  });

  it('finds an article', () => {
    cy.log(`API TOKEN: ${Cypress.env('apiToken')}`);
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
      expect(response.body.article.category).to.have.property('slug', 'news');
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

  // it('finds a page', () => {
  //   cy.request({
  //     url: `/api/sidebar/documents/1cS3u5bdBP7sg29t-nBW8UgvUHDNpiZRFccZA53A04sU?token=${Cypress.env(
  //       'apiToken'
  //     )}`,
  //   }).should((response) => {
  //     // should determine if this is an article or a page
  //     expect(response.body).to.have.property('documentType', 'page');

  //     // should return site-wide data for the sidebar form select menus
  //     expect(response.body.authors).to.have.length.of.at.least(1);
  //     expect(response.body.categories).to.have.length.of.at.least(1);
  //     expect(response.body.organization_locales).to.have.length.of.at.least(1);
  //     expect(response.body.tags).to.have.length.of.at.least(1);
  //     expect(response.body.homepage_layout_datas).to.have.length.of.at.least(1);
  //     expect(response.body.page_google_documents).to.have.length.of.at.least(1);
  //     expect(response.body.editorUrl).not.to.be.empty;

  //     // should return article-specific data
  //     // expect(response.body.article).to.be.instanceOf(Object);
  //     expect(response.body.page).not.to.be.empty;
  //     expect(response.body.page).to.have.property('slug', 'test-page-1');
  //     expect(response.body.page.page_translations).to.have.length(1);
  //     expect(response.body.page.page_translations[0]).to.have.any.keys(
  //       'headline',
  //       'id',
  //       'published',
  //       'search_title',
  //       'search_description',
  //       'locale_code'
  //     );
  //   });
  // });

  it('responds with sitewide data for an unknown (new) document', () => {
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
});
