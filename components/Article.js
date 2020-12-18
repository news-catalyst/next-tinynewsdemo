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
  siteMetadata,
}) {
  const isAmp = useAmp();

  return (
    <Layout meta={siteMetadata} locale={currentLocale} article={article}>
      <GlobalNav metadata={siteMetadata} sections={sections} />
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
      <GlobalFooter metadata={siteMetadata} />
    </Layout>
  );
}
