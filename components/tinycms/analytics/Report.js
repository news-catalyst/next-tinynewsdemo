import React, { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import { getMetricsData } from '../../../lib/analytics';
import { formatDate } from '../../../lib/utils';
import NewsletterSignupFormData from './NewsletterSignupFormData';
import ReadingFrequencyData from './ReadingFrequencyData';

const Report = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [viewID, setViewID] = useState(
    process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );
  const [reportData, setReportData] = useState(INITIAL_STATE);
  // const [eventsData, setEventsData] = useState(INITIAL_STATE);
  // const [donorData, setDonorData] = useState(INITIAL_STATE);
  const [subscriberData, setSubscriberData] = useState(INITIAL_STATE);
  const [timeReportData, setTimeReportData] = useState(INITIAL_STATE);
  const [pageViewReportData, setPageViewReportData] = useState(INITIAL_STATE);
  const [geoReportData, setGeoReportData] = useState(INITIAL_STATE);
  const [referralData, setReferralData] = useState(INITIAL_STATE);
  const [readingDepthData, setReadingDepthData] = useState({});
  const [sortedReadingDepth, setSortedReadingDepth] = useState([]);
  const [readingDepthTableRows, setReadingDepthTableRows] = useState([]);
  const [startDate, setStartDate] = useState(addDays(new Date(), -30));
  const [endDate, setEndDate] = useState(new Date());
  const [average, setAverage] = useState(0);
  const [timeAverage, setTimeAverage] = useState(0);

  const displayTimeResults = (response, initialData, setData) => {
    const queryResult = response.result.reports[0].data.rows;
    const total = response.result.reports[0].data.totals[0].values[0];

    setTimeAverage(parseInt(total / response.result.reports[0].data.rowCount));

    let labels = [];
    let values = [];

    queryResult.forEach((row) => {
      let formattedDate = formatDate(row.dimensions[0]);
      let value = row.metrics[0].values[0];

      labels.push(formattedDate);
      values.push(value);
    });

    setData({
      ...initialData,
      labels,
      values,
    });
  };

  const displayResults = (response, initialData, setData) => {
    const queryResult = response.result.reports[0].data.rows;

    let labels = [];
    let values = [];

    queryResult.forEach((row) => {
      let label = row.dimensions[0];
      if (label === '/') {
        label += ' (homepage)';
      }
      let value = row.metrics[0].values[0];

      labels.push(label);
      values.push(value);
    });

    setData({
      ...initialData,
      labels,
      values,
    });
  };

  const displayGeo = (response) => {
    const queryResult = response.result.reports[0].data.rows;

    let labels = [];
    let values = [];

    queryResult.forEach((row) => {
      let label = row.dimensions.join(' - ');
      let value = row.metrics[0].values[0];

      labels.push(label);
      values.push(value);
    });

    setGeoReportData({
      ...geoReportData,
      labels,
      values,
    });
  };

  const displayCustomResults = (response, initialData, setData) => {
    // console.log('custom dimension response: ', response);

    const queryResult = response.result.reports[0].data.rows;

    let labels = [];
    let values = [];

    queryResult.forEach((row) => {
      let label = row.dimensions.join(' - ');
      let value = row.metrics[0].values[0];

      labels.push(label);
      values.push(value);
    });

    setData({
      ...initialData,
      labels,
      values,
    });
  };

  let readingDepthRows = [];
  const displayReadingDepthResults = (response, initialData, setData) => {
    const queryResult = response.result.reports[0].data.rows;
    // console.log('reading depth: ', queryResult);

    let collectedData = {};
    queryResult.forEach((row) => {
      let articlePath = row.dimensions[3];

      if (articlePath !== '/') {
        let percentage = row.dimensions[1];
        let count = row.metrics[0].values[0];
        if (collectedData[articlePath]) {
          collectedData[articlePath][percentage] = count;
        } else {
          collectedData[articlePath] = {};
          collectedData[articlePath][percentage] = count;
        }
      }
    });

    var sortable = [];
    Object.keys(collectedData).forEach((path) => {
      let read25 = 0;
      let readFullArticleCount = 0;
      Object.keys(collectedData[path]).forEach((pct) => {
        if (pct === '25%') {
          read25 = collectedData[path][pct];
        }
        if (pct === '100%') {
          readFullArticleCount = collectedData[path][pct];
        }
      });
      let readFullArticlePct = 0;
      if (read25 > 0) {
        readFullArticlePct = (readFullArticleCount / read25) * 100;
      }
      collectedData[path]['readFull'] = Math.round(readFullArticlePct);
      sortable.push([path, readFullArticlePct]);
    });

    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });

    setSortedReadingDepth(sortable);
    sortedReadingDepth.map((item) => {
      readingDepthRows.push(
        <tr>
          <td>{item[0]}</td>
          <td>{readingDepthData[item[0]]['25%']}</td>
          <td>{readingDepthData[item[0]]['50%']}</td>
          <td>{readingDepthData[item[0]]['75%']}</td>
          <td>{readingDepthData[item[0]]['100%']}</td>
          <td>{readingDepthData[item[0]]['readFull']}%</td>
        </tr>
      );
    });
    console.log('readingDepthRows:', readingDepthRows);
    setReadingDepthTableRows(readingDepthRows);
    setReadingDepthData(collectedData);
  };

  useEffect(() => {
    const sessionsMetric = 'ga:sessions';
    const usersMetric = 'ga:users';
    const pageViewsMetric = 'ga:pageviews';
    const timeMetric = 'ga:avgSessionDuration';

    const dimensions = ['ga:date'];
    getMetricsData(viewID, startDate, endDate, [sessionsMetric], dimensions)
      .then((resp) => displayTimeResults(resp, reportData, setReportData))
      .catch((error) => console.error(error));

    getMetricsData(viewID, startDate, endDate, [timeMetric], dimensions)
      .then((resp) =>
        displayTimeResults(resp, timeReportData, setTimeReportData)
      )
      .catch((error) => console.error(error));

    const pvDimensions = ['ga:pagePath'];
    const orderBy = { fieldName: pageViewsMetric, order: 'DESCENDING' };
    getMetricsData(
      viewID,
      startDate,
      endDate,
      [pageViewsMetric],
      pvDimensions,
      orderBy
    )
      .then((resp) =>
        displayResults(resp, pageViewReportData, setPageViewReportData)
      )
      .catch((error) => console.error(error));

    const geoDimensions = ['ga:country', 'ga:region'];
    getMetricsData(
      viewID,
      startDate,
      endDate,
      [sessionsMetric, pageViewsMetric],
      geoDimensions
    )
      .then((resp) => displayGeo(resp))
      .catch((error) => console.error(error));

    // const customDimensionDonor = ['ga:dimension4'];
    // getMetricsData(
    //   viewID,
    //   startDate,
    //   endDate,
    //   [pageViewsMetric],
    //   customDimensionDonor
    // )
    //   .then((resp) => displayCustomResults(resp, donorData, setDonorData))
    //   .catch((error) => console.error(error));

    // const customDimensionSubscriber = ['ga:dimension5'];
    // getMetricsData(
    //   viewID,
    //   startDate,
    //   endDate,
    //   [pageViewsMetric],
    //   customDimensionSubscriber
    // )
    //   .then((resp) =>
    //     displayCustomResults(resp, subscriberData, setSubscriberData)
    //   )
    //   .catch((error) => console.error(error));

    const referralDimension = ['ga:source'];
    getMetricsData(
      viewID,
      startDate,
      endDate,
      [sessionsMetric],
      referralDimension
    )
      .then((resp) => {
        displayResults(resp, referralData, setReferralData);
      })
      .catch((error) => console.error(error));

    let eventMetrics = ['ga:totalEvents'];
    let eventDimensions = [
      'ga:eventCategory',
      'ga:eventAction',
      'ga:eventLabel',
      'ga:pagePath',
    ];

    getMetricsData(viewID, startDate, endDate, eventMetrics, eventDimensions, {
      filters: 'ga:eventCategory==NTG Article Milestone',
    })
      .then((resp) => {
        displayReadingDepthResults(resp, readingDepthData, setReadingDepthData);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container">
      <section className="section">
        <p className="content">
          Data from {startDate.toLocaleDateString()} to{' '}
          {endDate.toLocaleDateString()}.
        </p>
      </section>
      <section className="section">
        <div className="content">
          <p className="subtitle is-5">Sessions per day</p>

          <table className="table is-fullwidth" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sessions</th>
              </tr>
            </thead>
            <tbody>
              {reportData.labels.map((label, i) => (
                <tr>
                  <td>{label}</td>
                  <td>{reportData.values[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="section">
        <div className="content">
          <p className="subtitle is-5">Sessions by geographic region</p>

          <table className="table is-fullwidth" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Country - Region</th>
                <th>Sessions</th>
              </tr>
            </thead>
            <tbody>
              {geoReportData.labels.map((label, i) => (
                <tr>
                  <td>{label}</td>
                  <td> {geoReportData.values[i]} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="section">
        <div className="content">
          <p className="subtitle is-5">Average session duration</p>

          <p>Overall average: {timeAverage} seconds</p>

          <table className="table is-fullwidth" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Seconds</th>
              </tr>
            </thead>
            <tbody>
              {timeReportData.labels.map((label, i) => (
                <tr>
                  <td> {label} </td>
                  <td> {timeReportData.values[i]} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="content">
          <h2 className="subtitle">Sessions by referral source</h2>

          <table className="table is-fullwidth" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Subscriber</th>
                <th>Sessions</th>
              </tr>
            </thead>
            <tbody>
              {referralData.labels.map((label, i) => (
                <tr>
                  <td>{label}</td>
                  <td>{referralData.values[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="subtitle">Page views</h2>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Path</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {pageViewReportData.labels.map((label, i) => (
              <tr>
                <td>{label}</td>
                <td>{pageViewReportData.values[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <div className="content">
          <p className="subtitle is-5">Reading Depth</p>

          <table className="table is-fullwidth" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th></th>
                <th colSpan="4">Percentage Read</th>
              </tr>
              <tr>
                <th>Article</th>
                <th>25%</th>
                <th>50%</th>
                <th>75%</th>
                <th>100%</th>
                <th>Read Full</th>
              </tr>
            </thead>
            <tbody>{readingDepthTableRows}</tbody>
          </table>
        </div>
      </section>

      <section className="section"></section>
      <ReadingFrequencyData
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
      />

      {/* <section className="section">
        <h2 className="subtitle">Sessions by audience segment: donor</h2>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Donor</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {donorData.labels.map((label, i) => (
              <tr>
                <td>{label}</td>
                <td>{donorData.values[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section> */}

      {/* <section className="section">
        <h2 className="subtitle">Sessions by audience segment: subscriber</h2>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {subscriberData.labels.map((label, i) => (
              <tr>
                <td>{label}</td>
                <td>{subscriberData.values[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section> */}

      <p className="title is-2">Newsletter Data</p>

      <NewsletterSignupFormData
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default Report;
