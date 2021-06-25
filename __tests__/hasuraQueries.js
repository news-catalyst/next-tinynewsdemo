import { hasuraGetCustomDimension, hasuraGetDataImports, hasuraGetDonationClicks, hasuraGetGeoSessions, hasuraGetNewsletterImpressions, hasuraGetPageViews, hasuraGetReadingDepth, hasuraGetReadingFrequency, hasuraGetReferralSessions, hasuraGetSessionDuration, hasuraGetSessions, hasuraGetYesterday } from '../lib/analytics';
import { hasuraGetHomepageEditor, hasuraGetHomepageLayouts, hasuraGetHomepageData, hasuraListLocales, hasuraSearchArticles, hasuraGetPagePreview, hasuraGetPage, hasuraGetLayout, hasuraGetMetadataByLocale, hasuraPreviewArticleBySlug, hasuraGetArticleBySlug, hasuraListAllPageSlugsPreview, hasuraListAllPageSlugs, hasuraListAllArticleSlugs, hasuraPreviewArticlePage, hasuraArticlePage } from '../lib/articles';
import { hasuraGetHomepageLayout, hasuraListHomepageLayoutSchemas, hasuraStreamArticles } from '../lib/homepage';

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

it('gets data to article page', () => {
  params['localeCode'] = 'en-US';
  params['slug'] = 'kensingtons-last-minute-gift-guide';
  params['categorySlug'] = 'news';
  return hasuraArticlePage(params).then(response => {
    expect(response.data).toHaveProperty('article_slug_versions');
    expect(response.data.article_slug_versions).toHaveLength(1);
    expect(response.data.article_slug_versions[0]).toHaveProperty('article');
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

it('gets homepage layout by id', () => {
  params['id'] = 1;
  return hasuraGetHomepageLayout(params).then(response => {
    expect(response.data).toHaveProperty('homepage_layout_schemas_by_pk');
  });
});

it('gets stream articles', () => {
  params['localeCode'] = 'en-US';
  params['ids'] = [145];
  return hasuraStreamArticles(params).then(response => {
    expect(response.data).toHaveProperty('articles');
  });
});

it('lists layout schemas', () => {
  params['localeCode'] = 'en-US';
  return hasuraListHomepageLayoutSchemas(params).then(response => {
    expect(response.data).toHaveProperty('homepage_layout_schemas');
  });
});

describe('analytics', () => {
  let startDate = '2021-06-01';
  let endDate = '2021-06-10';

  it('gets all data imports', () => {
    return hasuraGetDataImports(params).then(response => {
      expect(response.data).toHaveProperty('ga_data_imports');
    });
  });

  it('gets referral sessions', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;

    return hasuraGetReferralSessions(params).then(response => {
      expect(response.data).toHaveProperty('ga_referral_sessions');
    });
  });

  it('gets geo sessions', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;

    return hasuraGetGeoSessions(params).then(response => {
      expect(response.data).toHaveProperty('ga_geo_sessions');
    });
  });

  it('gets sessions', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;

    return hasuraGetSessions(params).then(response => {
      expect(response.data).toHaveProperty('ga_sessions');
    });
  });

  it('gets yesterdays data', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;

    return hasuraGetYesterday(params).then(response => {
      expect(response.data).toHaveProperty('donorDimensions');
      expect(response.data).toHaveProperty('subscriberDimensions');
      expect(response.data).toHaveProperty('ga_page_views');
      expect(response.data).toHaveProperty('ga_reading_depth');
      expect(response.data).toHaveProperty('ga_sessions');
    });
  });

  it('gets session duration', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;

    return hasuraGetSessionDuration(params).then(response => {
      expect(response.data).toHaveProperty('ga_session_duration');
    });
  });

  it('gets reading depth', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;

    return hasuraGetReadingDepth(params).then(response => {
      expect(response.data).toHaveProperty('ga_reading_depth');
      expect(response.data).toHaveProperty('ga_page_views');
    });
  });

  it('gets custom dimensions', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;
    params['dimension'] = 'dimension4';

    return hasuraGetCustomDimension(params).then(response => {
      expect(response.data).toHaveProperty('ga_custom_dimensions');
    });
  });

  it('gets reading frequency', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;

    return hasuraGetReadingFrequency(params).then(response => {
      expect(response.data).toHaveProperty('ga_reading_frequency');
    });
  });

  it('gets donation clicks', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;

    return hasuraGetDonationClicks(params).then(response => {
      expect(response.data).toHaveProperty('ga_donor_reading_frequency');
      expect(response.data).toHaveProperty('ga_donation_clicks');
      expect(response.data).toHaveProperty('ga_page_views');
    });
  });

  it('gets newsletter impressions', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;

    return hasuraGetNewsletterImpressions(params).then(response => {
      expect(response.data).toHaveProperty('ga_newsletter_impressions');
    });
  });

  it('gets page views', () => {
    params['startDate'] = startDate;
    params['endDate'] = endDate;
    params['limit'] = 100;

    return hasuraGetPageViews(params).then(response => {
      expect(response.data).toHaveProperty('ga_page_views');
    });
  });
});

const shared = require("../script/shared");

describe('shared', () => {
  params['adminSecret'] = process.env.HASURA_ADMIN_SECRET;
  it('lists tags', () => {
    return shared.hasuraListTags(params).then(response => {
      expect(response.data).toHaveProperty('tags');
    });
  });
  it('lists sections', () => {
    return shared.hasuraListSections(params).then(response => {
      expect(response.data).toHaveProperty('categories');
    });
  });
  it('lists all locales', () => {
    return shared.hasuraListAllLocales(params).then(response => {
      expect(response.data).toHaveProperty('locales');
    });
  });
  it('lists organization locales', () => {
    return shared.hasuraListLocales(params).then(response => {
      expect(response.data).toHaveProperty('organization_locales');
    });
  });
  it('lists organizations', () => {
    return shared.hasuraListOrganizations(params).then(response => {
      expect(response.data).toHaveProperty('organizations');
    });
  });
  it('gets data for article RSS', () => {
    params['localeCode'] = 'en-US';
    return shared.hasuraGetArticlesRss(params).then(response => {
      expect(response.data).toHaveProperty('articles');
      expect(response.data.articles[0]).toHaveProperty('category');
      expect(response.data.articles[0]).toHaveProperty('slug');
      expect(response.data.articles[0]).toHaveProperty('author_articles');
      expect(response.data.articles[0]).toHaveProperty('article_translations');
    });
  });
})