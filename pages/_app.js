import { useEffect } from 'react';
import Router from 'next/router';
import {
  useAnalytics,
  initialize,
  trackReadingHistoryWithPageView,
} from '../lib/hooks/useAnalytics.js';
import { SessionProvider } from 'next-auth/react';
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
  const hookObj = useAnalytics();

  const isAmp = useAmp();
  useEffect(() => {
    if (isAmp) {
      return true;
    }

    initialize(hookObj);

    let pagePath = window.location.pathname + window.location.search;
    const handleRouteChange = () => {
      if (!/tinycms/.test(pagePath)) {
        let routeChangeData = trackReadingHistoryWithPageView(hookObj);
        hookObj.trackPageViewedWithDimensions(pagePath, routeChangeData);
      }
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  });

  return (
    // Avoids flickering/session loading on first load.
    <SessionProvider session={pageProps.session}>
      <GlobalStyles />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
