import Layout from '../Layout';
import HomepageHeader from './HomepageHeader';
import Grid from './Grid';

function partition(array, isValid) {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []]
  );
}

export default function CurriculumHomepage({
  siteMetadata,
  sections,
  locale,
  streamArticles,
}) {
  let curriculumArticles = streamArticles
    .filter((article) => article.category.slug === 'curriculum')
    .reverse();

  const [week0, main] = partition(curriculumArticles, (article) => {
    const translation =
      article.article_translations[article.article_translations.length - 1];

    if (translation.headline.includes('Week 0')) {
      return true;
    } else {
      return false;
    }
  });

  curriculumArticles = week0.concat(main);

  const documentationArticles = streamArticles
    .filter((article) => article.category.slug === 'documentation')
    .reverse();

  return (
    <div className="homepage">
      <Layout
        meta={siteMetadata}
        sections={sections}
        locale={locale}
        renderFooter={false}
      >
        <HomepageHeader />
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
