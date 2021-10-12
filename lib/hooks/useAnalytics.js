import ReactGA from 'react-ga';
import storage from 'local-storage-fallback';
import { getCookieConsentValue } from 'react-cookie-consent';
import { getQueryVariable } from '../utils.js';

export const trackReadingHistoryWithPageView = (hookObj) => {
  hookObj.logReadingHistory();
  const readingHistory = hookObj.summarizeReadingHistory();
  hookObj.setDimension('dimension2', readingHistory);
  return {
    dimension2: readingHistory,
  };
};

export const initialize = (hookObj) => {
  const {
    init,
    trackPageViewedWithDimensions,
    setDimension,
    logReadingHistory,
    summarizeReadingHistory,
    donorStatusFromStorage,
    newsletterStatusFromStorage,
    trackMailChimpParams,
  } = hookObj;

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

  init(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
  let readingDimensionsData = trackReadingHistoryWithPageView(hookObj);
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
};

export const useAnalytics = () => {
  return {
    init: (trackingId) => {
      if (getCookieConsentValue()) {
        console.log('Initialising ReactGA with trackingId:', trackingId);
        ReactGA.initialize(trackingId, { debug: true });
      }
    },
    trackPageViewed: (path) => {
      if (!getCookieConsentValue()) {
        return true;
      }

      if (path) {
        return ReactGA.pageview(path);
      }
      return ReactGA.pageview(
        window.location.pathname + window.location.search
      );
    },
    trackEvent: (params) => {
      if (!getCookieConsentValue()) {
        return true;
      }

      ReactGA.event(params);
    },
    setDimension: (dimension, value) => {
      if (!getCookieConsentValue()) {
        return true;
      }

      let fields = {};
      fields[dimension] = value;
      ReactGA.set(fields);
    },
    trackPageViewedWithDimensions: (path, dimensions) => {
      if (!getCookieConsentValue()) {
        return true;
      }

      // let fields = {};
      // fields[dimensionName] = dimensionData;

      if (path) {
        return ReactGA.pageview(path, dimensions);
      }
      return ReactGA.pageview(
        window.location.pathname + window.location.search,
        fields
      );
    },
    trackMailChimpParams: () => {
      if (!getCookieConsentValue()) {
        return true;
      }

      let campaignId = getQueryVariable('mc_cid');
      let emailId = getQueryVariable('mc_eid');

      if (campaignId && emailId) {
        let cookieValue = {
          campaignId: campaignId,
          emailId: emailId,
        };
        storage.setItem('TNCNewsletterSubscriber', JSON.stringify(cookieValue));
        return true;
      } else {
        return false;
      }
    },
    newsletterStatusFromStorage: () => {
      if (!getCookieConsentValue()) {
        return true;
      }

      return storage.getItem('TNCNewsletterSubscriber');
    },
    logReadingHistory: () => {
      if (!getCookieConsentValue()) {
        return true;
      }

      let history = JSON.parse(storage.getItem('TNCHistory'));
      if (!history || !Array.isArray(history)) {
        console.log('logReadingHistory: resetting history!', history);
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
      if (!getCookieConsentValue()) {
        return true;
      }

      return storage.getItem('TNCDonor');
    },
    checkReferrer: (referrer) => {
      if (!getCookieConsentValue()) {
        return true;
      }

      if (!referrer) {
        return false;
      }

      let parsedReferrer = new URL(referrer);
      if (/monkeypod\.io/.test(parsedReferrer.hostname)) {
        storage.setItem('TNCDonor', true);
        return true;
      }
      return false;
    },
    summarizeReadingHistory: () => {
      if (!getCookieConsentValue()) {
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
