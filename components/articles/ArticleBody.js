import { useState, useEffect } from 'react';
import { useScrollPercentage } from 'react-scroll-percentage';
import tw from 'twin.macro';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import { renderBody } from '../../lib/utils.js';
import PromotionBlock from '../plugins/PromotionBlock';
import { PostTextContainer, PostText } from '../common/CommonStyles.js';

const ArticleBodyWrapper = tw.section`mb-4`;
const SectionContainer = tw.div`w-full px-5 items-center flex flex-col flex-nowrap mx-auto max-w-7xl`;
const BlockWrapper = tw.div`max-w-2xl w-full`;

export default function ArticleBody({ article, ads, isAmp, locale, metadata }) {
  const body = renderBody(
    locale,
    article.article_translations,
    ads,
    isAmp,
    metadata
  );

  const { trackEvent } = useAnalytics();

  const [ref, percentage] = useScrollPercentage();
  const [oneQuarterReached, setOneQuarterReached] = useState(false);
  const [oneHalfReached, setOneHalfReached] = useState(false);
  const [threeQuartersReached, setThreeQuarterSReached] = useState(false);
  const [fullReached, setFullReached] = useState(false);

  useEffect(() => {
    if (!oneQuarterReached && percentage >= 0.25) {
      trackEvent({
        action: '25%',
        category: 'NTG article milestone',
        label: article.headline,
        value: 25,
        non_interaction: true,
      });
      setOneQuarterReached(true);
    }

    if (!oneHalfReached && percentage >= 0.5) {
      trackEvent({
        action: '50%',
        category: 'NTG article milestone',
        label: article.headline,
        value: 50,
        non_interaction: true,
      });
      setOneHalfReached(true);
    }

    if (!threeQuartersReached && percentage >= 0.75) {
      trackEvent({
        action: '75%',
        category: 'NTG article milestone',
        label: article.headline,
        value: 75,
        non_interaction: true,
      });
      setThreeQuarterSReached(true);
    }

    if (!fullReached && percentage >= 1) {
      trackEvent({
        action: '100%',
        category: 'NTG article milestone',
        label: article.headline,
        value: 100,
        non_interaction: true,
      });
      setFullReached(true);
    }
  }, [
    percentage,
    article.headline,
    trackEvent,
    oneQuarterReached,
    oneHalfReached,
    threeQuartersReached,
    fullReached,
  ]);

  return (
    <ArticleBodyWrapper>
      <SectionContainer ref={ref}>
        <PostText>
          <PostTextContainer>{body}</PostTextContainer>
        </PostText>
        <BlockWrapper>
          <PromotionBlock metadata={metadata} prefer="newsletter" />
        </BlockWrapper>
      </SectionContainer>
    </ArticleBodyWrapper>
  );
}
