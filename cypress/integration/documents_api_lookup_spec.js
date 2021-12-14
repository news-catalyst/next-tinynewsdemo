describe('document API', () => {
  it('finds an article', () => {
    cy.request({
      url: `/api/sidebar/documents/1LSyMzR1KxyKoml6q56DYQaxEV8Qm4EZo2y_xEFIkvGw?token=${Cypress.env(
        'API_TOKEN'
      )}`,
    }).should((response) => {
      // should determine if this is an article or a page
      expect(response.body).to.have.property('documentType', 'article');

      // should return site-wide data for the sidebar form select menus
      expect(response.body.authors).to.have.length.of.at.least(1);
      expect(response.body.categories).to.have.length.of.at.least(1);
      expect(response.body.organization_locales).to.have.length.of.at.least(1);
      expect(response.body.tags).to.have.length.of.at.least(1);

      // should return article-specific data
      // expect(response.body.article).to.be.instanceOf(Object);
      expect(response.body.article).not.to.be.empty;
      expect(response.body.article).to.have.property(
        'slug',
        'test-doc-for-article-features'
      );
      expect(response.body.article.category).to.have.property(
        'slug',
        'community'
      );
      expect(response.body.article.author_articles).not.to.be.empty;
      expect(response.body.article.tag_articles).to.have.length(2);
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
});
