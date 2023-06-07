import ReactGA from 'react-ga4';
import storage from 'local-storage-fallback';
import { getCookieConsentValue } from 'react-cookie-consent';
import { getSite, getQueryVariable, trackingIdMapping } from '../utils.js';

const ga4MeasurementIds = {
  'next-tinynewsdemo': 'G-2NRQT8YFM0',
};

const cookiesAccepted = () => {
  const consentValue = getCookieConsentValue();
  return consentValue === 'true';
};

export const trackReadingHistoryWithPageView = (hookObj) => {
  hookObj.logReadingHistory();
  const readingHistory = hookObj.summarizeReadingHistory();
  hookObj.setDimension('dimension2', readingHistory);
  return {
    dimension2: readingHistory,
  };
};

function trackNewsletterVisits({
  trackMailChimpParams,
  newsletterStatusFromStorage,
  setDimension,
}) {
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

// hookObj is the hook object returned by useAnalytics
export const initialize = (hookObj) => {
  const {
    init,
    trackPageViewedWithDimensions,
    // setDimension,
    // donorStatusFromStorage,
    // newsletterStatusFromStorage,
    // trackMailChimpParams,
  } = hookObj;

  init(window.location.host);
  // let readingDimensionsData = trackReadingHistoryWithPageView(hookObj);
  // let newsletterDimensionsData = trackNewsletterVisits(trackMailChimpParams);
  //
  // let dimensionsData = {
  //   ...readingDimensionsData,
  //   ...newsletterDimensionsData,
  // };
  //
  // let donorStatus = donorStatusFromStorage();
  // if (donorStatus) {
  //   setDimension('dimension4', true);
  //   dimensionsData['dimension4'] = true;
  // }

  let dimensionsData = {};
  let pagePath = window.location.pathname + window.location.search;
  if (!/tinycms/.test(pagePath)) {
    // In the current GA4 code dimensionsData is ignored
    trackPageViewedWithDimensions(pagePath, dimensionsData);
  }
};

const sendPageView = (path = '', title = '') => {
  // TODO: Track if GA is initialized
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
    // Unused
    trackPageViewed: (path) => {
      if (!cookiesAccepted()) {
        return true;
      }
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
    // Dimensions are actually fields with values that are then defined as dimensions on the GA4 Admin
    // We can likely allow them to be sent with some extra work for ga4 compatibility
    setDimension: (dimension, value) => {
      if (!cookiesAccepted()) {
        return true;
      }

      // let fields = {};
      // fields[dimension] = value;
      // ReactGA.set(fields);
      return false;
    },
    // The "dimensions" concept works differently in ga4
    trackPageViewedWithDimensions: (path, dimensions) => {
      if (!cookiesAccepted()) {
        return true;
      }
      // Ignoring dimensions for GA4
      return sendPageView(path);
      // let fields = {};
      // fields[dimensionName] = dimensionData;
      // NOTE: Disabled custom dimensions for GA4 move
      // if (path) {
      //   return ReactGA.pageview(path, dimensions);
      // }
      // return ReactGA.pageview(
      //   window.location.pathname + window.location.search,
      //   fields
      // );
    },
    trackMailChimpParams: () => {
      if (!cookiesAccepted()) {
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
      if (!cookiesAccepted()) {
        return true;
      }

      return storage.getItem('TNCNewsletterSubscriber');
    },
    logReadingHistory: () => {
      if (!cookiesAccepted()) {
        return true;
      }

      let history = JSON.parse(storage.getItem('TNCHistory'));
      if (!history || !Array.isArray(history)) {
        // console.log('logReadingHistory: resetting history!', history);
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
    checkReferrer: (referrer) => {
      if (!cookiesAccepted()) {
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
