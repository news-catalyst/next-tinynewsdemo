import tw from 'twin.macro';
import GridItem from './GridItem';

const SectionLayout = tw.section`flex mb-24`;
const SectionContainer = tw.div`px-5 max-w-7xl mx-auto w-full`;
const GridContainer = tw.div`flex flex-row flex-wrap w-full`;
const Title = tw.h2`text-3xl font-bold max-w-2xl mx-auto text-center mb-8`;

export default function Grid({ header, type, articles }) {
  let gridItems = [];

  for (var i = 0; i < articles.length; i++) {
    const translation =
      articles[i].article_translations[
        articles[i].article_translations.length - 1
      ];
    gridItems.push(
      <GridItem
        header={translation.headline}
        dek={translation.search_description}
        hammer={type === 'curriculum' && `Week ${i + 1}`}
        article={articles[i]}
      />
    );
  }

  return (
    <SectionLayout>
      <SectionContainer>
        <Title>{header}</Title>
        <GridContainer>{gridItems}</GridContainer>
      </SectionContainer>
    </SectionLayout>
  );
}
