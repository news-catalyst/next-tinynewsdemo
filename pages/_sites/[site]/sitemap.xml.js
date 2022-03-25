import { hasuraGetSiteData } from '../../../script/shared.js';

function generateSiteMap(data) {
  const siteURL =
    data.site_metadatas[0].site_metadata_translations[0].data.siteUrl;
  const siteName =
    data.site_metadatas[0].site_metadata_translations[0].data.shortName;

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      <url>
        <loc>${siteURL}</loc>
        <changefreq>hourly</changefreq>
        <priority>1</priority>
      </url>
      <url>
        <loc>${siteURL}/cookies</loc>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
      </url>
      <url>
        <loc>${siteURL}/about</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
      </url>
      <url>
        <loc>${siteURL}/donate</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
      </url>
      <url>
        <loc>${siteURL}/staff</loc>
        <changefreq>weekly</changefreq>
        <priority>0.4</priority>
      </url>
      <url>
        <loc>${siteURL}/thank-you</loc>
        <changefreq>weekly</changefreq>
        <priority>0.4</priority>
      </url> 
      ${data.articles.map((article) => {
        const category = article.category.slug;
        const slug = article.slug;
        const lastmod = article.article_translations[0].last_published_at;
        const headline = article.article_translations[0].headline;
        const publicationDate =
          article.article_translations[0].first_published_at;

        // console.log(lastmod);

        return `<url>
        <loc>${siteURL}/articles/${category}/${slug}</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
        <lastmod>${lastmod}</lastmod>
        <news:news>
          <news:publication>
            <news:name>${siteName}</news:name>
            <news:language>en</news:language>
          </news:publication>
          <news:publication_date>${publicationDate}</news:publication_date>
          <news:title>${headline}</news:title>
        </news:news>
      </url>`;
      })}
      ${data.categories.map((category) => {
        const slug = category.slug;

        return `<url>
        <loc>${siteURL}/categories/${slug}</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
      </url>`;
      })}

      ${data.pages.map((page) => {
        const slug = page.slug;

        if (['about', 'donate', 'thank-you'].includes(slug)) {
          return null;
        }

        return `<url>
        <loc>${siteURL}/static/${slug}</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
      </url>`;
      })}

      ${data.tags.map((tag) => {
        const slug = tag.slug;

        return `<url>
        <loc>${siteURL}/tags/${slug}</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
      </url>`;
      })}

      ${data.authors.map((author) => {
        const slug = author.slug;

        return `<url>
        <loc>${siteURL}/authors/${slug}</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
      </url>`;
      })}



    </urlset>`;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;

  // We make an API call to gather the URLs for our site
  const response = await hasuraGetSiteData({
    url: apiUrl,
    site: site,
  });

  const siteURL =
    response.data.site_metadatas[0].site_metadata_translations[0].data.siteUrl;
  // console.log(
  //   response.data.site_metadatas[0].site_metadata_translations[0].data.siteUrl
  // );

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(response.data);

  context.res.setHeader('Content-Type', 'text/xml');
  // // we send the XML to the browser
  context.res.write(sitemap);
  context.res.end();

  return {
    props: {},
  };
}

export default SiteMap;
