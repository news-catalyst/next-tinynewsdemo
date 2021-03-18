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
    trackPageViewed,
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
    trackPageViewed();
    const handleRouteChange = (url) => {
      logReadingHistory();
      const readingHistory = summarizeReadingHistory();
      setDimension('dimension2', readingHistory);
      console.log('tracking dimension2:', readingHistory);
      // setDimension('dimension4', false); // donor
      // setDimension('dimension5', true); // subscriber
      trackPageViewed(url);
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
