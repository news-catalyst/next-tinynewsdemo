import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import Comments from './articles/Comments.js';
import ArticleFooter from './articles/ArticleFooter.js';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';

export default function Article({
  article,
  currentLocale,
  sections,
  ads,
  siteMetadata,
}) {
  const isAmp = useAmp();

  return (
    <Layout
      meta={siteMetadata}
      locale={currentLocale}
      article={article}
      sections={sections}
    >
      <div className="post">
        <ArticleHeader article={article} isAmp={isAmp} locale={currentLocale} />
        <section className="section post__body rich-text" key="body">
          <ArticleBody
            article={article}
            isAmp={isAmp}
            ads={ads}
            locale={currentLocale}
          />
          <ArticleFooter
            article={article}
            isAmp={isAmp}
            locale={currentLocale}
          />
        </section>
        <Comments article={article} isAmp={isAmp} />
      </div>
    </Layout>
  );
}
