import Layout from '../Layout';
import HomepageHeader from './HomepageHeader';
import Grid from './Grid';

export default function CurriculumHomepage({
  siteMetadata,
  sections,
  locale,
  streamArticles,
}) {
  const curriculumArticles = streamArticles
    .filter((article) => article.category.slug === 'curriculum')
    .reverse();

  return (
    <div className="homepage">
      <Layout meta={siteMetadata} sections={sections} locale={locale}>
        <HomepageHeader />
        <Grid
          header="Your eight week course"
          type="curriculum"
          articles={curriculumArticles}
        />
        <Grid
          header="Tech stack documentation"
          type="documentation"
          articles={curriculumArticles}
        />
      </Layout>
    </div>
  );
}
