import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import Comments from './articles/Comments';
import ArticleFooter from './articles/ArticleFooter';
import Recirculation from './articles/Recirculation';
import { generateArticleUrl } from '../lib/utils.js';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';
import { NextSeo } from 'next-seo';

export default function Article({
  article,
  sections,
  ads,
  siteMetadata,
  sectionArticles,
  renderFooter,
  monkeypodLink,
  site,
}) {
  const isAmp = useAmp();

  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMetadata['siteUrl'];
  // this is used for the canonical link tag in the Layout component
  let canonicalArticleUrl = generateArticleUrl(baseUrl, article);
  siteMetadata['canonicalUrl'] = canonicalArticleUrl;
  const translation = article.article_translations[0];

  console.log(translation)
  console.log(article)

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

  // console.log('Returning layout and children components...');
  return (
    <Layout
      meta={siteMetadata}
      article={article}
      sections={sections}
      renderFooter={renderFooter}
      monkeypodLink={monkeypodLink}
      site={site}
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
  title={translation.searchTitle || translation.headline} // get the search title if defined, if not fall back to headline
  description={translation.searchDescription} // search description (labeled as just description in the sidebar) is required, so we can rely on it being there
  canonical={canonicalArticleUrl} // defined on line 24 of the component
  openGraph={{
    title: translation.facebookTitle || translation.headline, // get facebook title if defined, if not fall back to headline
    description: translation.facebookDescription || translation.searchDescription, // get FB description if defined, if not fall back to search description
    url: canonicalArticleUrl,
    type: 'article',
    article: {
      publishedTime: translation.first_published_at,
      modifiedTime: translation.last_published_at,
      authors: article.author_articles.map((a) => [`${siteMetadata.siteUrl}/authors/${a.author.slug}`]),  // generate author URL for each author
      section: article.category.category_translations[0].title,
      tags: article.tag_articles.map((t) => [t.tag.slug])
    },
    images: [
      {
        url: siteMetadata.defaultSocialImage,
        width: siteMetadata.defaultSocialImageWidth, 
        height: siteMetadata.defaultSocialImageHeight,
      },
    ],
  }}
/>
    </Layout>
  );
}
