import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import Comments from './articles/Comments.js';
import ArticleFooter from './articles/ArticleFooter.js';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';

export default function Article({ article, sections, ads }) {
  const isAmp = useAmp();

  return (
    <Layout meta={article} sections={sections}>
      <div className="post">
        <ArticleHeader article={article} isAmp={isAmp} />
        <section className="section post__body rich-text" key="body">
          <ArticleBody article={article} isAmp={isAmp} ads={ads} />
          <ArticleFooter article={article} isAmp={isAmp} />
        </section>
        <Comments article={article} isAmp={isAmp} />
      </div>
    </Layout>
  );
}
