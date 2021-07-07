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

  const preProgram = streamArticles
    .filter(
      (article) => article.category.slug === 'pre-program-information-training'
    )
    .reverse();

  const documentationArticles = streamArticles
    .filter((article) => article.category.slug === 'documentation')
    .reverse();

  return (
    <div className="homepage">
      <Layout meta={siteMetadata} sections={sections} locale={locale}>
        <HomepageHeader />
        <Grid
          header="Pre-Program Information & Training"
          type="pre-program"
          articles={preProgram}
        />
        <Grid
          header="Your 12 week course"
          type="curriculum"
          articles={curriculumArticles}
        />
        <Grid
          header="Tech stack documentation"
          type="documentation"
          articles={documentationArticles}
        />
      </Layout>
    </div>
  );
}
