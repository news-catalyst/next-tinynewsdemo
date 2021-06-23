import tw from 'twin.macro';
import PromotionBlock from '../plugins/PromotionBlock';
import ArticleLink from './ArticleLink';
import ExpandedTextWithImageAd from '../ads/ExpandedTextWithImageAd';
import AdPromotion from '../ads/AdPromotion.js';

const SectionLayout = tw.section`flex mb-8`;
const SectionContainer = tw.div`md:grid md:grid-cols-packageLayoutTablet lg:grid-cols-packageLayoutDesktop flex flex-row flex-wrap grid-rows-1 w-full px-5 mx-auto max-w-7xl`;
const Block = tw.div`w-full`;
const BlockHead = tw.h3`flex items-end flex-row flex-nowrap mb-4 text-2xl mb-6 font-bold`;
const BlockList = tw.ul`list-outside`;
const PromotionContainer = tw.div`md:border-l md:border-gray-200 md:ml-8 md:pl-8 w-full`;

export default function ArticleStream({
  articles,
  showCategory,
  isAmp,
  title,
  metadata,
  ads,
}) {
  const AD_PLACEMENT_INDEX = 3;

  const renderArticle = function (article) {
    return (
      <ArticleLink
        key={article.id}
        article={article}
        amp={isAmp}
        showCategory={showCategory}
        metadata={metadata}
      />
    );
  };

  const renderAd = function (ad) {
    return (
      <ExpandedTextWithImageAd
        ad={{
          brand: ad.promoterDisplayName,
          image: {
            url: ad.promoterImage,
            alt: ad.promoterImageAlternativeText,
          },
          header: ad.heading,
          body: ad.content,
          call: ad.callToAction,
          url: ad.resolvedCallToActionURL,
          pixel: ad.pixel,
        }}
        isAmp={isAmp}
      />
    );
  };
  let adIndex = 0;

  const articleStream = articles.map((article, i) => {
    const streamArticle = renderArticle(article);
    if (i > 0 && i % AD_PLACEMENT_INDEX === 0 && ads.length === 0 && adIndex === 0) {
      adIndex = adIndex + 1
      return (
        <>
          <AdPromotion metadata={metadata}/>
          {streamArticle}
        </>
      )
    }
    if (i > 0 && i % AD_PLACEMENT_INDEX === 0 && adIndex < ads.length) {
      const ad = renderAd(ads[adIndex]);
      adIndex++;
      return (
        <>
          {ad}
          {streamArticle}
        </>
      );
    } else {
      return streamArticle;
    }
  });

  return (
    <SectionLayout>
      <SectionContainer>
        <Block>
          <BlockHead>{title}</BlockHead>
          <BlockList>{articleStream}</BlockList>
        </Block>
        <PromotionContainer>
          <PromotionBlock metadata={metadata} prefer="donation" />
        </PromotionContainer>
      </SectionContainer>
    </SectionLayout>
  );
}
