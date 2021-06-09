import { hasuraGetHomepageEditor, hasuraGetHomepageLayouts, hasuraGetHomepageData, hasuraListLocales, hasuraSearchArticles, hasuraListAllTags, hasuraListAllSections, hasuraGetPagePreview, hasuraGetPage, hasuraGetLayout, hasuraGetMetadataByLocale, hasuraPreviewArticleBySlug, hasuraGetArticleBySlug, hasuraListAllPageSlugsPreview, hasuraListAllPageSlugs, hasuraListAllArticleSlugs, hasuraListAllAuthorPaths, hasuraTagPage, hasuraCategoryPage, hasuraPreviewArticlePage, hasuraArticlePage, hasuraAuthorPage } from '../lib/articles';
require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const apiToken = "oaklyn";

let params = {
  url: apiUrl,
  orgSlug: apiToken
};

it('lists locales for oaklyn', () => {
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


it('searches articles', () => {
  params['localeCode'] = 'en-US';
  params['term'] = 'gift';

  return hasuraSearchArticles(params).then(response => {
    expect(response.data).toHaveProperty('articles');
    expect(response.data.articles).toHaveLength(1);
    expect(response.data.articles[0]).toHaveProperty('id');
    expect(response.data.articles[0]).toHaveProperty('article_translations');
    expect(response.data.articles[0]).toHaveProperty('category');
    expect(response.data.articles[0]).toHaveProperty('slug');
    expect(response.data.articles[0]).toHaveProperty('author_articles');
    expect(response.data.articles[0]).toHaveProperty('tag_articles');
  });
});

it('gets data for homepage editor', () => {
  params['localeCode'] = 'en-US';

  return hasuraGetHomepageEditor(params).then(response => {
    expect(response.data).toHaveProperty('homepage_layout_schemas');
    expect(response.data).toHaveProperty('homepage_layout_datas');
    expect(response.data).toHaveProperty('categories');
    expect(response.data).toHaveProperty('site_metadatas');
    expect(response.data).toHaveProperty('tags');
    expect(response.data.homepage_layout_schemas).toHaveLength(3);
    expect(response.data.homepage_layout_datas[0]).toHaveProperty('first_article');
    expect(response.data.homepage_layout_datas[0]).toHaveProperty('second_article');
    expect(response.data.homepage_layout_datas[0]).toHaveProperty('third_article');
  });
});

it('gets homepage layouts', () => {
  return hasuraGetHomepageLayouts(params).then(response => {
    expect(response.data).toHaveProperty('homepage_layout_schemas');
    expect(response.data.homepage_layout_schemas).toHaveLength(3);
  });
});

it('gets homepage data', () => {
  return hasuraGetHomepageData(params).then(response => {
    expect(response.data).toHaveProperty('homepage_layout_datas');
    expect(response.data.homepage_layout_datas[0]).toHaveProperty('first_article');
    expect(response.data.homepage_layout_datas[0]).toHaveProperty('second_article');
    expect(response.data.homepage_layout_datas[0]).toHaveProperty('third_article');
    expect(response.data.homepage_layout_datas[0]).toHaveProperty('homepage_layout_schema');
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

it('gets all sections', () => {
  return hasuraListAllSections(params).then(response => {
    expect(response.data).toHaveProperty('categories');
    expect(response.data.categories[0]).toHaveProperty('slug');
    expect(response.data.categories[0]).toHaveProperty('category_translations');
  });
});

it('gets data for page preview', () => {
  params['localeCode'] = 'en-US';
  params['slug'] = 'about';
  return hasuraGetPagePreview(params).then(response => {
    expect(response.data).toHaveProperty('pages');
    expect(response.data).toHaveProperty('categories');
    expect(response.data).toHaveProperty('site_metadatas');
  });
});

it('gets data for rendering a page', () => {
  params['localeCode'] = 'en-US';
  params['slug'] = 'about';
  return hasuraGetPage(params).then(response => {
    expect(response.data).toHaveProperty('page_slug_versions');
    expect(response.data).toHaveProperty('authors');
    expect(response.data).toHaveProperty('categories');
    expect(response.data).toHaveProperty('site_metadatas');
  });
});

it('gets layout', () => {
  params['localeCode'] = 'en-US';
  return hasuraGetLayout(params).then(response => {
    expect(response.data).toHaveProperty('categories');
    expect(response.data).toHaveProperty('site_metadatas');
  });
});

it('gets site metadata by locale', () => {
  params['localeCode'] = 'en-US';
  return hasuraGetMetadataByLocale(params).then(response => {
    expect(response.data).toHaveProperty('organization_locales');
    expect(response.data).toHaveProperty('site_metadatas');
  });
});

it('gets data to author page', () => {
  params['localeCode'] = 'en-US';
  params['authorSlug'] = 'jacqui-lough';
  return hasuraAuthorPage(params).then(response => {
    expect(response.data).toHaveProperty('authors');
    expect(response.data.authors).toHaveLength(1);
    expect(response.data.authors[0]).toHaveProperty('slug');
    expect(response.data).toHaveProperty('articles');
    expect(response.data).toHaveProperty('categories');
    expect(response.data).toHaveProperty('site_metadatas');
  });
});

it('gets data to article page', () => {
  params['localeCode'] = 'en-US';
  params['slug'] = 'kensingtons-last-minute-gift-guide';
  params['categorySlug'] = 'news';
  return hasuraArticlePage(params).then(response => {
    console.log(response.data);
    expect(response.data).toHaveProperty('articles');
    expect(response.data.articles).toHaveLength(1);
    expect(response.data.articles[0]).toHaveProperty('slug');
    expect(response.data.articles[0]).toHaveProperty('article_translations');
    expect(response.data.articles[0]).toHaveProperty('category');
    expect(response.data.articles[0]).toHaveProperty('author_articles');
  });
});

it('gets data to preview article page', () => {
  params['localeCode'] = 'en-US';
  params['slug'] = 'kensingtons-last-minute-gift-guide';
  params['categorySlug'] = 'news';
  return hasuraPreviewArticlePage(params).then(response => {
    expect(response.data).toHaveProperty('articles');
    expect(response.data.articles).toHaveLength(1);
    expect(response.data.articles[0]).toHaveProperty('slug');
    expect(response.data.articles[0]).toHaveProperty('article_translations');
    expect(response.data.articles[0]).toHaveProperty('category');
    expect(response.data.articles[0]).toHaveProperty('author_articles');
  });
});

it('gets data to preview an article by slug', () => {
  params['localeCode'] = 'en-US';
  params['slug'] = 'kensingtons-last-minute-gift-guide';
  return hasuraPreviewArticleBySlug(params).then(response => {
    expect(response.data).toHaveProperty('articles');
    expect(response.data.articles).toHaveLength(1);
    expect(response.data.articles[0]).toHaveProperty('slug');
    expect(response.data.articles[0]).toHaveProperty('article_translations');
    expect(response.data.articles[0]).toHaveProperty('category');
    expect(response.data.articles[0]).toHaveProperty('author_articles');
  });
});

it('gets data to get (public render) an article by slug', () => {
  params['localeCode'] = 'en-US';
  params['slug'] = 'kensingtons-last-minute-gift-guide';
  return hasuraGetArticleBySlug(params).then(response => {
    expect(response.data).toHaveProperty('articles');
    expect(response.data.articles).toHaveLength(1);
    expect(response.data.articles[0]).toHaveProperty('slug');
    expect(response.data.articles[0]).toHaveProperty('article_translations');
    expect(response.data.articles[0]).toHaveProperty('category');
    expect(response.data.articles[0]).toHaveProperty('author_articles');
  });
});
    // console.log(Object.keys(response.data));

it('lists all page slugs for preview', () => {
  return hasuraListAllPageSlugsPreview(params).then(response => {
    expect(response.data).toHaveProperty('pages');
    expect(response.data.pages[0]).toHaveProperty('page_translations');
    expect(response.data.pages[0]).toHaveProperty('slug');
  });
});

it('lists all published page slugs', () => {
  return hasuraListAllPageSlugs(params).then(response => {
    expect(response.data).toHaveProperty('pages');
    expect(response.data.pages[0]).toHaveProperty('page_translations');
    expect(response.data.pages[0]).toHaveProperty('slug');
  });
});

it('lists all published article slugs', () => {
  return hasuraListAllArticleSlugs(params).then(response => {
    expect(response.data).toHaveProperty('articles');
    expect(response.data.articles[0]).toHaveProperty('article_translations');
    expect(response.data.articles[0]).toHaveProperty('slug');
    expect(response.data.articles[0]).toHaveProperty('category');
  });
});

it('lists all author paths', () => {
  return hasuraListAllAuthorPaths(params).then(response => {
    expect(response.data).toHaveProperty('authors');
    expect(response.data.authors[0]).toHaveProperty('author_translations');
    expect(response.data.authors[0]).toHaveProperty('slug');
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

it('gets category page data', () => {
  params['localeCode'] = 'en-US';
  params['categorySlug'] = 'business';
  return hasuraCategoryPage(params).then(response => {
    expect(response.data).toHaveProperty('articles');
    expect(response.data).toHaveProperty('categories');
    expect(response.data.categories[0]).toHaveProperty('slug');
    expect(response.data.categories[0]).toHaveProperty('category_translations');
  });
});
    // console.log(Object.keys(response.data));