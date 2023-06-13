import ReactGA from 'react-ga4';
import storage from 'local-storage-fallback';
import { getCookieConsentValue } from 'react-cookie-consent';
import { getSite, ga4MeasurementIds } from '../utils.js';

const cookiesAccepted = () => {
  const consentValue = getCookieConsentValue();
  return consentValue === 'true';
};

// hookObj is the hook object returned by useAnalytics
export const initialize = (hookObj) => {
  const { init, trackPageViewed } = hookObj;
  init(window.location.host);
  let pagePath = window.location.pathname + window.location.search;
  if (!/tinycms/.test(pagePath)) {
    trackPageViewed(pagePath);
  }
};

const sendPageView = (path = '', title = '') => {
  if (!ReactGA || !ReactGA.isInitialized) {
    return;
  }
  const page = path || window.location.pathname + window.location.search;
  const ga4Params = {
    hitType: 'pageview',
    page,
    ...(title ? { title } : {}),
  };
  return ReactGA.send(ga4Params);
};

export const useAnalytics = () => {
  return {
    init: (host) => {
      if (cookiesAccepted()) {
        const site = getSite(host);
        // const mappingSiteTrackingID = trackingIdMapping();
        const trackingId = ga4MeasurementIds[site]; // mappingSiteTrackingID[site];
        if (trackingId) {
          ReactGA.initialize(trackingId);
        }
      }
    },
    trackPageViewed: (path) => {
      if (!cookiesAccepted()) {
        return true;
      }
      console.log(`==== Sending view for ${path}`);
      return sendPageView(path);
    },
    trackEvent: (params) => {
      if (!cookiesAccepted()) {
        return true;
      }
      // Correction for react-ga4
      if (params['non_interaction']) {
        params['nonInteraction'] = params['non_interaction'];
        delete params['non_interaction'];
      }
      ReactGA.event(params);
    },
    logReadingHistory: () => {
      if (!cookiesAccepted()) {
        return true;
      }

      let history = JSON.parse(storage.getItem('TNCHistory'));
      if (!history || !Array.isArray(history)) {
        history = [];
      }

      history.unshift({
        t: Date.now(),
        u: window.location.pathname,
      });

      const maximumNumberOfDays = 30;
      const dateCutoff = new Date();
      dateCutoff.setDate(dateCutoff.getDate() - maximumNumberOfDays);
      history = history.filter((item) => item.t > dateCutoff.getTime());

      storage.setItem('TNCHistory', JSON.stringify(history));
    },
    donorStatusFromStorage: () => {
      if (!cookiesAccepted()) {
        return true;
      }

      return storage.getItem('TNCDonor');
    },
    checkReferrerIsMonkeyPod: (referrer) => {
      if (!cookiesAccepted()) {
        return true;
      }

      if (!referrer) {
        return false;
      }

      let parsedReferrer = new URL(referrer);
      if (/monkeypod\.io/.test(parsedReferrer.hostname)) {
        storage.setItem('TNCDonor', 'true');
        return true;
      }
      return false;
    },
    summarizeReadingHistory: () => {
      if (!cookiesAccepted()) {
        return true;
      }

      let contactFrequency = '0 posts';
      const contactHistory = JSON.parse(storage.getItem('TNCHistory'));

      if (contactHistory) {
        // only count articles
        const articles = contactHistory.filter((item) =>
          item.u.includes('/articles/')
        );
        const articlesCount = articles.length;

        if (articlesCount == 1) {
          contactFrequency = '1 post';
        } else if (articlesCount >= 2 && articlesCount < 4) {
          contactFrequency = '2-3 posts';
        } else if (articlesCount >= 4 && articlesCount < 6) {
          contactFrequency = '4-5 posts';
        } else if (articlesCount >= 6 && articlesCount < 9) {
          contactFrequency = '6-8 posts';
        } else if (articlesCount >= 9 && articlesCount < 14) {
          contactFrequency = '9-13 posts';
        } else if (articlesCount >= 14 && articlesCount < 22) {
          contactFrequency = '14-21 posts';
        } else if (articlesCount >= 22 && articlesCount < 35) {
          contactFrequency = '22-34 posts';
        } else if (articlesCount >= 35 && articlesCount < 56) {
          contactFrequency = '35-55 posts';
        } else if (articlesCount >= 56) {
          contactFrequency = '56+';
        }
      }
      return contactFrequency;
    },
  };
};
