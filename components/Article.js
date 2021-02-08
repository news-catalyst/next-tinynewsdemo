import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import Comments from './articles/Comments';
import ArticleFooter from './articles/ArticleFooter';
import Recirculation from './articles/Recirculation';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';

export default function Article({
  article,
  locale,
  sections,
  ads,
  siteMetadata,
  sectionArticles,
}) {
  const isAmp = useAmp();

  return (
    <Layout meta={siteMetadata} article={article} sections={sections}>
      <div className="post">
        <ArticleHeader
          article={article}
          isAmp={isAmp}
          metadata={siteMetadata}
        />
        <section className="section post__body rich-text" key="body">
          <ArticleBody
            article={article}
            isAmp={isAmp}
            ads={ads}
            metadata={siteMetadata}
          />
          <ArticleFooter article={article} isAmp={isAmp} />
        </section>
        <Comments article={article} isAmp={isAmp} />
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
