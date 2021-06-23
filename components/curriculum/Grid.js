import tw from 'twin.macro';
import GridItem from './GridItem';

const SectionLayout = tw.section`flex mb-24`;
const SectionContainer = tw.div`px-5 max-w-7xl mx-auto w-full`;
const GridContainer = tw.div`flex flex-row flex-wrap w-full`;
const Title = tw.h2`text-3xl font-bold max-w-2xl mx-auto text-center mb-8`;

export default function Grid({ header, type, articles }) {
  let gridItems = [];

  if (type === 'curriculum') {
    for (var i = 0; i < articles.length; i++) {
      const translation =
        articles[i].article_translations[
          articles[i].article_translations.length - 1
        ];
      gridItems.push(
        <GridItem
          header={translation.headline}
          dek={translation.search_description}
          hammer={`Week ${i + 1}`}
          article={articles[i]}
        />
      );
    }
  }

  if (type === 'documentation') {
    const tech = [
      'Google Docs',
      'TinyCMS',
      'TinyCMS Analytics',
      'Letterhead',
      'MonkeyPod',
      'Coral Project',
      'Mailchimp',
      'Hootsuite',
    ];

    for (var j = 0; j < articles.length; j++) {
      const translation =
        articles[j].article_translations[
          articles[j].article_translations.length - 1
        ];

      gridItems.push(
        <GridItem
          header={`How to use ${tech[j]}`}
          dek="Lorem Ipsum"
          article={articles[j]}
        />
      );
    }
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
