import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import Comments from './articles/Comments';
import ArticleFooter from './articles/ArticleFooter';
import Recirculation from './articles/Recirculation';
import { generateArticleUrl } from '../lib/utils.js';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';

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
    </Layout>
  );
}
