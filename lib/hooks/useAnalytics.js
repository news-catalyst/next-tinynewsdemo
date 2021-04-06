import ReactGA from 'react-ga';
import storage from 'local-storage-fallback';
import Cookies from 'universal-cookie';
import { getQueryVariable } from '../utils.js';

export const useAnalytics = () => {
  return {
    init: (trackingId) => {
      console.log('Initialising ReactGA with trackingId:', trackingId);
      ReactGA.initialize(trackingId, { debug: true });
    },
    trackPageViewed: (path) => {
      if (path) {
        return ReactGA.pageview(path);
      }
      return ReactGA.pageview(
        window.location.pathname + window.location.search
      );
    },
    trackEvent: (params) => {
      ReactGA.event(params);
    },
    setDimension: (dimension, value) => {
      let fields = {};
      fields[dimension] = value;
      ReactGA.set(fields);
    },
    trackPageViewedWithDimensions: (path, dimensions) => {
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
      const cookies = new Cookies();

      let campaignId = getQueryVariable('mc_cid');
      let emailId = getQueryVariable('mc_eid');

      if (campaignId && emailId) {
        let cookieValue = {
          campaignId: campaignId,
          emailId: emailId,
        };
        cookies.set('nc_mct', JSON.stringify(cookieValue), {
          path: '/',
          maxAge: 3600, // Expires after 1hr
          sameSite: true,
        });
        return true;
      } else {
        return false;
      }
    },
    logReadingHistory: () => {
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
    checkReferrer: (referrer) => {
      const cookies = new Cookies();
      let parsedReferrer = new URL(referrer);
      if (/monkeypod\.io/.test(parsedReferrer.hostname)) {
        cookies.set('nc_donor', true, {
          path: '/',
          maxAge: 3600, // Expires after 1hr
          sameSite: true,
        });
        return true;
      }
      return false;
    },
    summarizeReadingHistory: () => {
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
