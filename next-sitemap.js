require('dotenv').config({ path: '.env.local' })

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  exclude: ['/tinycms', '/tinycms/*', '/*/preview/*'],
  priority: 0.5,
  transform: async (config, path) => {
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === '' || path === '/') {
      priority = 1;
      changefreq = 'hourly';
    }

    if (path.includes('/articles/')) {
      priority = 0.7;
    }

    if (path.includes('/en-US/')) {
      path = path.replace('/en-US', '');
    }

    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
