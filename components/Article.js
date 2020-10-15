import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import MainImage from './articles/MainImage.js';
import Tags from './articles/Tags.js';
import ArticleFooter from './articles/ArticleFooter.js';
import GlobalNav from './nav/GlobalNav.js';
import GlobalFooter from './nav/GlobalFooter.js';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';

export default function Article({ article, sections, tags }) {
  const isAmp = useAmp();
  console.log('all tags: ', tags);
  console.log('article tags: ', article.tags);
  console.log('article: ', article);

  return (
    <Layout meta={article}>
      <GlobalNav sections={sections} />
      <article className="container">
        <ArticleHeader article={article} />
        <MainImage article={article} isAmp={isAmp} />
        <ArticleBody article={article} isAmp={isAmp} />
        <Tags article={article} />
        <ArticleFooter article={article} isAmp={isAmp} />
      </article>
      <GlobalFooter />
    </Layout>
  );
}
