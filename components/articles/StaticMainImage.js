import tw from 'twin.macro';
import MainImage from './MainImage.js';
import { hasuraLocalizeText } from '../../lib/utils.js';

const StaticFeaturedMedia = tw.div`flex flex-col flex-nowrap items-center`;
const StaticFeaturedMediaFigure = tw.figure`flex flex-row flex-wrap w-full`;
const StaticFeaturedMediaWrapper = tw.div`w-full`;
const StaticFeaturedMediaCaption = tw.figcaption`text-sm text-gray-700 pt-1 inline-block`;

export default function StaticMainImage({ page, locale, isAmp, siteMetadata }) {
  // main image handling
  let mainImageNode;
  let mainImage = null;
  let pageContent = hasuraLocalizeText(
    locale,
    page.page_translations,
    'content'
  );
  if (
    pageContent !== undefined &&
    pageContent !== null &&
    typeof pageContent !== 'string'
  ) {
    try {
      mainImageNode = pageContent.find((node) => node.type === 'mainImage');
      if (mainImageNode) {
        mainImage = mainImageNode.children[0];
      }
    } catch (err) {
      console.error('error finding main image: ', err);
    }
  }

  return (
    <StaticFeaturedMedia>
      <StaticFeaturedMediaFigure>
        <StaticFeaturedMediaWrapper>
          {mainImage && (
            <MainImage articleContent={pageContent} isAmp={isAmp} />
          )}
        </StaticFeaturedMediaWrapper>
        <StaticFeaturedMediaCaption>
          {mainImage ? mainImage.imageAlt : null}
        </StaticFeaturedMediaCaption>
      </StaticFeaturedMediaFigure>
    </StaticFeaturedMedia>
  );
}
