import { useEffect } from 'react';
import Router from 'next/router';
import { useAnalytics } from '../lib/hooks/useAnalytics.js';
import { Provider } from 'next-auth/client';
import { useAmp } from 'next/amp';

export function reportWebVitals({ id, name, label, value }) {
  const { trackEvent } = useAnalytics();
  if (label === 'web-vital') {
    const event = {
      action: name,
      category: 'Web Vitals',
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      label: id,
      non_interaction: true,
    };
    trackEvent(event);
  }
}

const App = ({ Component, pageProps }) => {
  const {
    init,
    trackPageViewedWithDimension,
    setDimension,
    logReadingHistory,
    summarizeReadingHistory,
  } = useAnalytics();
  const isAmp = useAmp();
  useEffect(() => {
    if (isAmp) {
      return true;
    }
    init(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
    trackReadingHistoryWithPageView();
    trackNewsletterVisits();
    const handleRouteChange = () => {
      trackReadingHistoryWithPageView();
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  function trackNewsletterVisits() {
    const { trackMailChimpParams } = useAnalytics();
    let isSubscriber = trackMailChimpParams();
    if (isSubscriber) {
      setDimension('dimension5', true);
      trackPageViewedWithDimension(
        window.location.pathname + window.location.search,
        'dimension5',
        true
      );
    }
  }
  function trackReadingHistoryWithPageView() {
    logReadingHistory();
    const readingHistory = summarizeReadingHistory();
    setDimension('dimension2', readingHistory);
    trackPageViewedWithDimension(
      window.location.pathname + window.location.search,
      'dimension2',
      readingHistory
    );
  }

  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
