import '../styles.scss';
import { useEffect } from 'react';
import Router from 'next/router';
import * as gtag from '../lib/gtag';

export function reportWebVitals({ id, name, label, value }) {
  if (label === 'web-vital') {
    const event = {
      action: name,
      category: 'Web Vitals',
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      label: id,
      non_interaction: true,
    };
    gtag.event(event);
  }
}

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, []);

  return <Component {...pageProps} />
}

export default App;
