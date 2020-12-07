import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import MainImage from './articles/MainImage.js';
import Tags from './articles/Tags.js';
import ArticleFooter from './articles/ArticleFooter.js';
import GlobalNav from './nav/GlobalNav.js';
import GlobalFooter from './nav/GlobalFooter.js';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';

export default function Article({
  article,
  currentLocale,
  sections,
  tags,
  ads,
}) {
  const isAmp = useAmp();

  console.log('article:', article);
  return (
    <Layout meta={article}>
      <GlobalNav sections={sections} />
      <article className="container">
        <ArticleHeader article={article} locale={currentLocale} />
        <MainImage article={article} isAmp={isAmp} />
        <ArticleBody
          article={article}
          locale={currentLocale}
          isAmp={isAmp}
          ads={ads}
        />
        <Tags article={article} locale={currentLocale} />
        <ArticleFooter article={article} locale={currentLocale} isAmp={isAmp} />
      </article>
      <GlobalFooter />
    </Layout>
  );
}
