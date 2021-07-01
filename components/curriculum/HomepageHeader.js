import tw from 'twin.macro';
import Image from 'next/image';
import HomepageImage from '../../public/curriculum/homepage.jpg';

const SectionLayout = tw.section`flex mb-24`;
const SectionContainer = tw.div`px-5 max-w-7xl mx-auto flex flex-row flex-wrap w-full`;
const Card = tw.div`w-full shadow-lg border-gray-200 border`;
const CardImageWrapper = tw.div`w-full mb-8`;
const CardImg = tw.div`w-full h-96 bg-blue-500`;
const CardTextWrapper = tw.div`w-full px-8 pb-8`;
const Title = tw.h1`font-bold text-4xl text-center w-full mb-8 mx-auto`;
const Dek = tw.p`text-xl max-w-2xl mx-auto mb-4`;

export default function HomepageHeader() {
  return (
    <SectionLayout>
      <SectionContainer>
        <Card>
          <CardImageWrapper>
            <Image src={HomepageImage} alt="Paper airplanes" />
          </CardImageWrapper>
          <Title>Welcome to the Tiny News Collective Curriculum Site!</Title>
          <CardTextWrapper>
            <Dek>
              This site will provide the information and resources you need to
              navigate the 12-week TNC training course. You’ll find details
              about the two weekly sessions alongside helpful tutorials on tools
              and technology. Best of all? This site is published using the very
              CMS you’ll use in your tech stack, so we’re continually finding
              ways to make it simpler and more efficient. We’ll be updating it
              as we go, so be sure to check it often!
            </Dek>
          </CardTextWrapper>
        </Card>
      </SectionContainer>
    </SectionLayout>
  );
}
