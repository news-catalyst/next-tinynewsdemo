import { useEffect } from 'react';
import Router from 'next/router';
import { useAnalytics } from '../lib/hooks/useAnalytics.js';
import { Provider } from 'next-auth/client';
import { useAmp } from 'next/amp';
import GlobalStyles from './../components/GlobalStyles';

export function reportWebVitals({ id, name, label, value }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
    donorStatusFromStorage,
    newsletterStatusFromStorage,
    trackMailChimpParams,
  } = useAnalytics();
  const isAmp = useAmp();
  useEffect(() => {
    if (isAmp) {
      return true;
    }

    function trackNewsletterVisits(trackMailChimpParams) {
      let hitFromSubscriber = trackMailChimpParams();
      let isLoggedSubscriber = newsletterStatusFromStorage();
      if (hitFromSubscriber || isLoggedSubscriber) {
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

    init(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
    let readingDimensionsData = trackReadingHistoryWithPageView();
    let newsletterDimensionsData = trackNewsletterVisits(trackMailChimpParams);

    let dimensionsData = {
      ...readingDimensionsData,
      ...newsletterDimensionsData,
    };

    let donorStatus = donorStatusFromStorage();
    if (donorStatus) {
      setDimension('dimension4', true);
      dimensionsData['dimension4'] = true;
    }

    let pagePath = window.location.pathname + window.location.search;
    if (!/tinycms/.test(pagePath)) {
      trackPageViewedWithDimensions(pagePath, dimensionsData);
    }

    const handleRouteChange = () => {
      if (!/tinycms/.test(pagePath)) {
        let routeChangeData = trackReadingHistoryWithPageView();
        trackPageViewedWithDimensions(pagePath, routeChangeData);
      }
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  });

  return (
    <Provider session={pageProps.session}>
      <GlobalStyles />
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
