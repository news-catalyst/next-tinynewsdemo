import { useEffect } from 'react';
import Router from 'next/router';
import { useAnalytics } from '../lib/hooks/useAnalytics.js';
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
  const { init, trackPageViewed } = useAnalytics();
  const isAmp = useAmp();
  useEffect(() => {
    if (isAmp) {
      return true;
    }
    init(process.env.GA_TRACKING_ID);
    trackPageViewed();
    const handleRouteChange = (url) => {
      trackPageViewed(url);
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default App;
