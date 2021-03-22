import React, { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import { getMetricsData } from '../../../lib/analytics';
import { formatDate } from '../../../lib/utils';

const Report = () => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [viewID, setViewID] = useState(
    process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );
  const [reportData, setReportData] = useState(INITIAL_STATE);
  const [frequencyData, setFrequencyData] = useState(INITIAL_STATE);
  const [donorData, setDonorData] = useState(INITIAL_STATE);
  const [subscriberData, setSubscriberData] = useState(INITIAL_STATE);
  const [timeReportData, setTimeReportData] = useState(INITIAL_STATE);
  const [pageViewReportData, setPageViewReportData] = useState(INITIAL_STATE);
  const [geoReportData, setGeoReportData] = useState(INITIAL_STATE);
  const [referralData, setReferralData] = useState(INITIAL_STATE);
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
    console.log('custom dimension response: ', response);

    const queryResult = response.result.reports[0].data.rows;

    console.log('custom dimension result data: ', queryResult);

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

    const customDimensionFrequency = ['ga:dimension2'];
    getMetricsData(
      viewID,
      startDate,
      endDate,
      [pageViewsMetric],
      customDimensionFrequency
    )
      .then((resp) =>
        displayCustomResults(resp, frequencyData, setFrequencyData)
      )
      .catch((error) => console.error(error));

    const customDimensionDonor = ['ga:dimension4'];
    getMetricsData(
      viewID,
      startDate,
      endDate,
      [pageViewsMetric],
      customDimensionDonor
    )
      .then((resp) => displayCustomResults(resp, donorData, setDonorData))
      .catch((error) => console.error(error));

    const customDimensionSubscriber = ['ga:dimension5'];
    getMetricsData(
      viewID,
      startDate,
      endDate,
      [pageViewsMetric],
      customDimensionSubscriber
    )
      .then((resp) =>
        displayCustomResults(resp, subscriberData, setSubscriberData)
      )
      .catch((error) => console.error(error));

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
  }, []);

  console.log('startDate:', startDate);
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

          <table className="table">
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

          <table className="table">
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

          <table className="table">
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

          <table className="table">
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

        <table className="table">
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

      <section className="section"></section>

      <section className="section">
        <h2 className="subtitle">
          Page views by audience segment: reading frequency
        </h2>

        <table className="table">
          <thead>
            <tr>
              <th>Number of Articles</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {frequencyData.labels.map((label, i) => (
              <tr>
                <td>{label}</td>
                <td>{frequencyData.values[i]} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2 className="subtitle">Sessions by audience segment: donor</h2>

        <table className="table">
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
      </section>

      <section className="section">
        <h2 className="subtitle">Sessions by audience segment: subscriber</h2>

        <table className="table">
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
      </section>
    </div>
  );
};

export default Report;
