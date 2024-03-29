import tw from 'twin.macro';
import GridItem from './GridItem';

const SectionLayout = tw.section`flex mb-24`;
const SectionContainer = tw.div`px-5 max-w-7xl mx-auto w-full`;
const GridContainer = tw.div`flex flex-row flex-wrap w-full`;
const Title = tw.h2`text-3xl font-bold max-w-2xl mx-auto text-center mb-8`;

export default function Grid({ header, type, articles }) {
  let gridItems = [];
  let weekNumber = 1;

  for (var i = 0; i < articles.length; i++) {
    const translation =
      articles[i].article_translations[
        articles[i].article_translations.length - 1
      ];

    const mainImageNode = translation.main_image;
    let mainImage = null;

    if (mainImageNode && mainImageNode.children) {
      mainImage = mainImageNode.children[0];
    }

    let hammer = `Week ${weekNumber}`;

    if (translation.headline.includes('Week 0')) {
      hammer = 'Week 0';
    } else {
      weekNumber++;
    }

    gridItems.push(
      <GridItem
        header={translation.headline}
        dek={translation.search_description}
        image={mainImage}
        hammer={hammer}
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
