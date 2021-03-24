import React, { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import { getMetricsData } from '../../../lib/analytics';
import AverageSessionDuration from './AverageSessionDuration';
import DailySessions from './DailySessions';
import GeoSessions from './GeoSessions';
import NewsletterSignupFormData from './NewsletterSignupFormData';
import ReadingDepthData from './ReadingDepthData';
import ReadingFrequencyData from './ReadingFrequencyData';
import ReferralSource from './ReferralSource';

const Report = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [viewID, setViewID] = useState(
    process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );
  // const [eventsData, setEventsData] = useState(INITIAL_STATE);
  // const [donorData, setDonorData] = useState(INITIAL_STATE);
  // const [subscriberData, setSubscriberData] = useState(INITIAL_STATE);
  const [pageViewReportData, setPageViewReportData] = useState(INITIAL_STATE);
  const [startDate, setStartDate] = useState(addDays(new Date(), -30));
  const [endDate, setEndDate] = useState(new Date());

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

  useEffect(() => {
    const pageViewsMetric = 'ga:pageviews';

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
  }, []);

  return (
    <div className="container">
      <section className="section">
        <p className="content">
          Data from {startDate.toLocaleDateString()} to{' '}
          {endDate.toLocaleDateString()}.
        </p>
      </section>

      <DailySessions viewID={viewID} startDate={startDate} endDate={endDate} />

      <GeoSessions viewID={viewID} startDate={startDate} endDate={endDate} />
      <AverageSessionDuration
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
      />

      <ReferralSource viewID={viewID} startDate={startDate} endDate={endDate} />

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
      <ReadingDepthData
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
      />

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
