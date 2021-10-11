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
export const Anchor = styled.a(({ meta }) => ({
  ...tw`text-black cursor-pointer border-b`,
  borderColor: meta.primaryColor,
}));
export const SectionLayout = tw.section`flex mb-8`;
export const SectionContainer = tw.div`md:grid md:grid-cols-packageLayoutTablet lg:grid-cols-packageLayoutDesktop flex flex-row flex-wrap grid-rows-1 w-full px-5 mx-auto max-w-7xl`;
export const Block = tw.div`w-full`;
export const AddButton = tw.a`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;
export const DeleteButton = tw.button`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded`;
export const Blockquote = styled.blockquote(({ meta }) => ({
  ...tw`text-lg pl-6 py-2 mb-5 border-l-4 italic`,
  borderColor: meta.primaryColor,
}));
export const HorizontalRule = tw.hr`border-0 bg-gray-500 text-gray-500 h-px max-w-full my-8`;
