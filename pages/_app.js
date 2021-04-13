import { useEffect } from 'react';
import Router from 'next/router';
import { useAnalytics } from '../lib/hooks/useAnalytics.js';
import { Provider } from 'next-auth/client';
import { useAmp } from 'next/amp';
import GlobalStyles from './../components/GlobalStyles';

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
    trackPageViewedWithDimensions,
    setDimension,
    logReadingHistory,
    summarizeReadingHistory,
    donorStatusFromCookie,
  } = useAnalytics();
  const isAmp = useAmp();
  useEffect(() => {
    if (isAmp) {
      return true;
    }
    init(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
    let readingDimensionsData = trackReadingHistoryWithPageView();
    let newsletterDimensionsData = trackNewsletterVisits();

    let dimensionsData = {
      ...readingDimensionsData,
      ...newsletterDimensionsData,
    };

    let donorStatus = donorStatusFromCookie();
    if (donorStatus) {
      setDimension('dimension4', true);
      dimensionsData['dimension4'] = true;
    }

    let pagePath = window.location.pathname + window.location.search;
    console.log(
      'tracking page view',
      pagePath,
      'with custom dimensions:',
      dimensionsData
    );
    trackPageViewedWithDimensions(pagePath, dimensionsData);

    const handleRouteChange = () => {
      let routeChangeData = trackReadingHistoryWithPageView();
      console.log(
        'tracking page view for route change',
        pagePath,
        'with custom dimensions:',
        routeChangeData
      );
      trackPageViewedWithDimensions(pagePath, routeChangeData);
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
      return {
        dimension5: true,
      };
    } else {
      return {};
    }
  }
  function trackReadingHistoryWithPageView() {
    logReadingHistory();
    const readingHistory = summarizeReadingHistory();
    setDimension('dimension2', readingHistory);
    return {
      dimension2: readingHistory,
    };
  }

  return (
    <Provider session={pageProps.session}>
      <GlobalStyles />
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
