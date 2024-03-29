import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import Comments from './articles/Comments';
import ArticleFooter from './articles/ArticleFooter';
import Recirculation from './articles/Recirculation';
import TwitterMeta from './TwitterMeta';
import { generateArticleUrl } from '../lib/utils.js';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';
import { NextSeo, NewsArticleJsonLd } from 'next-seo';

export default function Article({
  article,
  sections,
  ads,
  siteMetadata,
  sectionArticles,
  renderFooter,
  monkeypodLink,
  site,
  bannerAds,
}) {
  const isAmp = useAmp();

  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMetadata['siteUrl'];
  // this is used for the canonical link tag in the Layout component
  let canonicalArticleUrl = generateArticleUrl(baseUrl, article);
  siteMetadata['canonicalUrl'] = canonicalArticleUrl;
  const translation = article.article_translations[0];

  const displayComments = siteMetadata['commenting'] === 'on';

  let mainImageNode;
  let mainImage = null;
  let content = article.article_translations[0].content;
  if (
    content !== undefined &&
    content !== null &&
    typeof content !== 'string'
  ) {
    try {
      mainImageNode = content.find((node) => node.type === 'mainImage');

      if (mainImageNode) {
        mainImage = mainImageNode.children[0];
        if (mainImage.imageUrl) {
          siteMetadata['coverImage'] = mainImage.imageUrl;
          siteMetadata['coverImageWidth'] = mainImage.width;
          siteMetadata['coverImageHeight'] = mainImage.height;
        }
      }
    } catch (err) {
      console.error('error finding main image: ', err);
    }
  }

  return (
    <Layout
      meta={siteMetadata}
      article={article}
      sections={sections}
      renderFooter={renderFooter}
      monkeypodLink={monkeypodLink}
      site={site}
      bannerAds={bannerAds}
    >
      <div className="post">
        <ArticleHeader
          article={article}
          isAmp={isAmp}
          metadata={siteMetadata}
          mainImage={mainImage}
        />
        <section className="section post__body rich-text" key="body">
          <ArticleBody
            article={article}
            isAmp={isAmp}
            ads={ads}
            metadata={siteMetadata}
            site={site}
            monkeypodLink={monkeypodLink}
          />
          <ArticleFooter
            article={article}
            isAmp={isAmp}
            site={site}
            metadata={siteMetadata}
          />
        </section>
        {displayComments && <Comments article={article} isAmp={isAmp} />}
        <Recirculation
          articles={sectionArticles}
          isAmp={isAmp}
          siteMetadata={siteMetadata}
          section={article.category}
        />
      </div>

      <NextSeo
        title={translation.search_title || translation.headline} // get the search title if defined, if not fall back to headline
        description={translation.search_description} // search description (labeled as just description in the sidebar) is required, so we can rely on it being there
        canonical={canonicalArticleUrl} // defined on line 24 of the component
        openGraph={{
          title: translation.facebook_title || translation.headline, // get facebook title if defined, if not fall back to headline
          description:
            translation.facebook_description || translation.search_description, // get FB description if defined, if not fall back to search description
          url: canonicalArticleUrl,
          type: 'article',
          article: {
            publishedTime: translation.first_published_at,
            modifiedTime: translation.last_published_at,
            authors: article.author_articles.map(
              (a) => `${siteMetadata.siteUrl}/authors/${a.author.slug}`
            ), // generate author URL for each author
            section: article.category.category_translations[0].title,
            tags: article.tag_articles.map(
              (t) => t.tag.tag_translations[0].title
            ),
          },
          images: [
            {
              url: mainImage?.imageUrl,
              width: mainImage?.width,
              height: mainImage?.height,
            },
          ],
        }}
      />
      <NewsArticleJsonLd
        url={canonicalArticleUrl}
        title={translation.search_title || translation.headline}
        images={[mainImage?.imageUrl]}
        datePublished={translation.first_published_at}
        dateModified={translation.last_published_at}
        authorName={article.author_articles.map(
          (a) => `${a.author.first_names} ${a.author.last_name}`
        )}
        publisherName={siteMetadata.shortName}
        publisherLogo={siteMetadata.logo}
        description={translation.search_description}
      />
      <TwitterMeta
        override={{
          title: translation.twitter_title || translation.headline,
          description:
            translation.twitter_description || translation.search_description,
          image: mainImage?.imageUrl,
          author: article.author_articles[0]?.author?.twitter,
        }}
        siteMetadata={siteMetadata}
      />
    </Layout>
  );
}
