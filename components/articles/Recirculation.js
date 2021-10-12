import tw from 'twin.macro';
import ArticleLink from '../homepage/ArticleLink';
import { hasuraLocaliseText } from '../../lib/utils.js';

const RecirculationSection = tw.section`border-t border-gray-200 pt-12`;
const RecirculationContainer = tw.div`flex flex-col flex-nowrap max-w-5xl w-full mx-auto px-5`;
const RecirculationTitle = tw.h3`text-3xl mb-6 font-bold self-end w-full`;
const RecirculationList = tw.ul`w-full self-end list-outside`;

export default function Recirculation({
  articles,
  isAmp,
  siteMetadata,
  section,
}) {
  if (articles === null || articles === undefined || articles.length <= 0) {
    return null;
  }
  const localisedSection = hasuraLocaliseText(
    section.category_translations,
    'title'
  );

  return (
    <RecirculationSection>
      <RecirculationContainer>
        <RecirculationTitle>
          More in {localisedSection} from {siteMetadata.shortName}
        </RecirculationTitle>
        <RecirculationList>
          {articles &&
            articles.map((streamArticle) => (
              <ArticleLink
                key={streamArticle.slug}
                article={streamArticle}
                showCategory={false}
                isAmp={isAmp}
                metadata={siteMetadata}
              />
            ))}
        </RecirculationList>
      </RecirculationContainer>
    </RecirculationSection>
  );
}
