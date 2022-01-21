import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import Comments from './articles/Comments';
import ArticleFooter from './articles/ArticleFooter';
import Recirculation from './articles/Recirculation';
import { hasuraLocalizeText, generateArticleUrl } from '../lib/utils.js';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';

export default function Article({
  article,
  sections,
  ads,
  siteMetadata,
  sectionArticles,
  renderFooter,
  locales,
  publishedLocales,
  locale,
}) {
  const isAmp = useAmp();

  // console.log('Article component article: ', article);
  // console.log('Article locale:', locale, article.article_translations.length);

  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMetadata['siteUrl'];
  // this is used for the canonical link tag in the Layout component
  let canonicalArticleUrl = generateArticleUrl(baseUrl, article);
  siteMetadata['canonicalUrl'] = canonicalArticleUrl;

  const displayComments = siteMetadata['commenting'] === 'on';

  let mainImageNode;
  let mainImage = null;
  let localisedContent = hasuraLocalizeText(
    locale,
    article.article_translations,
    'content'
  );
  if (
    localisedContent !== undefined &&
    localisedContent !== null &&
    typeof localisedContent !== 'string'
  ) {
    try {
      mainImageNode = localisedContent.find(
        (node) => node.type === 'mainImage'
      );

      if (mainImageNode) {
        mainImage = mainImageNode.children[0];
        if (mainImage.imageUrl) {
          siteMetadata['coverImage'] = mainImage.imageUrl;
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
      locale={locale}
    >
      <div className="post">
        <ArticleHeader
          article={article}
          isAmp={isAmp}
          metadata={siteMetadata}
          mainImage={mainImage}
          locales={locales}
          publishedLocales={publishedLocales}
          locale={locale}
        />
        <section className="section post__body rich-text" key="body">
          <ArticleBody
            article={article}
            isAmp={isAmp}
            ads={ads}
            metadata={siteMetadata}
            locale={locale}
          />
          <ArticleFooter
            article={article}
            isAmp={isAmp}
            metadata={siteMetadata}
            locale={locale}
          />
        </section>
        {displayComments && <Comments article={article} isAmp={isAmp} />}
        <Recirculation
          articles={sectionArticles}
          isAmp={isAmp}
          siteMetadata={siteMetadata}
          section={article.category}
          locale={locale}
        />
      </div>
    </Layout>
  );
}
