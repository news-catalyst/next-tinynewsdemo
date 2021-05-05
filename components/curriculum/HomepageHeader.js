import tw from 'twin.macro';

const SectionLayout = tw.section`flex mb-24`;
const SectionContainer = tw.div`px-5 max-w-7xl mx-auto flex flex-row flex-wrap w-full`;
const Card = tw.div`w-full shadow-lg border-gray-200 border`;
const CardImageWrapper = tw.div`w-full mb-8`;
const CardImg = tw.div`w-full h-96 bg-blue-500`;
const CardTextWrapper = tw.div`w-full px-8 pb-8`;
const Title = tw.h1`font-bold text-4xl leading-6 text-center w-full mb-8 max-w-2xl mx-auto`;
const Dek = tw.p`text-xl max-w-2xl mx-auto mb-4`;

export default function HomepageHeader() {
  return (
    <SectionLayout>
      <SectionContainer>
        <Card>
          <CardImageWrapper>
            <CardImg />
          </CardImageWrapper>
          <CardTextWrapper>
            <Title>Tiny News Collective Curriculum</Title>
            <Dek>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna.
            </Dek>
            <Dek>
              Augue eget arcu dictum varius duis. Luctus venenatis lectus magna
              fringilla urna.
            </Dek>
          </CardTextWrapper>
        </Card>
      </SectionContainer>
    </SectionLayout>
  );
}
