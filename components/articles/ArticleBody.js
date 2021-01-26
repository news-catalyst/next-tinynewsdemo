import { useState, useEffect } from 'react';
import { useScrollPercentage } from 'react-scroll-percentage';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import { renderBody } from '../../lib/utils.js';
import NewsletterBlock from '../plugins/NewsletterBlock';

export default function ArticleBody({ article, locale, ads, isAmp, metadata }) {
  const body = renderBody(article, ads, isAmp);

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
  }, [percentage]);

  return (
    <section className="section post__body rich-text" key="body">
      <div id="articleText" className="section__container" ref={ref}>
        <div className="post-text">
          <div>{body}</div>
        </div>
        <NewsletterBlock
          metadata={metadata}
          headline={article.headline}
          wrap={false}
        />
      </div>
    </section>
  );
}
