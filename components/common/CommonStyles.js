import tw, { styled } from 'twin.macro';
import Typography from './Typography';

export const ArticleTitle = styled.h1(({ meta }) => ({
  ...tw`text-4xl lg:text-5xl leading-none mb-3 font-bold w-full`,
  fontFamily: Typography[meta.theme].ArticleTitle,
}));
export const PostText = tw.div`flex mt-1 pt-8 mb-12 w-full mx-auto`;
export const PostTextContainer = tw.div`max-w-2xl w-full mx-auto`;
export const Paragraph = tw.p`text-lg mb-5 leading-relaxed`;
export const H1 = tw.h1`font-bold text-3xl lg:text-4xl leading-tight mt-10 mb-4`;
export const H2 = tw.h2`font-bold text-2xl leading-tight mt-10 mb-4`;
export const H3 = tw.h3`font-bold text-xl leading-tight mt-10 mb-4`;
export const Anchor = tw.a`text-black cursor-pointer border-b border-blue-500`;
export const SectionLayout = tw.section`flex mb-8`;
export const SectionContainer = tw.div`md:grid md:grid-cols-packageLayoutTablet lg:grid-cols-packageLayoutDesktop flex flex-row flex-wrap grid-rows-1 w-full px-5 mx-auto max-w-7xl`;
export const Block = tw.div`w-full`;
