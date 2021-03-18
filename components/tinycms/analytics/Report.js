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
  const [timeReportData, setTimeReportData] = useState(INITIAL_STATE);
  const [pageViewReportData, setPageViewReportData] = useState(INITIAL_STATE);
  const [geoReportData, setGeoReportData] = useState(INITIAL_STATE);
  const [startDate, setStartDate] = useState(addDays(new Date(), -30));
  const [endDate, setEndDate] = useState(new Date());
  const [average, setAverage] = useState(0);
  const [timeAverage, setTimeAverage] = useState(0);

  // TODO: clean this up, move into separate components
  const displayResults = (response) => {
    console.log('response: ', response);

    const queryResult = response.result.reports[0].data.rows;
    const total = response.result.reports[0].data.totals[0].values[0];

    setAverage(parseInt(total / response.result.reports[0].data.rowCount));
    console.log('average: ', average);

    let labels = [];
    let values = [];

    queryResult.forEach((row) => {
      labels.push(formatDate(row.dimensions[0]));
      values.push(row.metrics[0].values[0]);
    });

    console.log('reportData: ', reportData);
    setReportData({
      ...reportData,
      labels,
      values,
    });
  };

  const displayTimeResults = (response) => {
    console.log('session duration response: ', response);

    const queryResult = response.result.reports[0].data.rows;
    const total = response.result.reports[0].data.totals[0].values[0];

    console.log('query result: ', queryResult);
    setTimeAverage(parseInt(total / response.result.reports[0].data.rowCount));
    console.log('average: ', timeAverage);

    let labels = [];
    let values = [];

    queryResult.forEach((row) => {
      let formattedDate = formatDate(row.dimensions[0]);
      let value = row.metrics[0].values[0];

      labels.push(formattedDate);
      values.push(value);
    });

    setTimeReportData({
      ...timeReportData,
      labels,
      values,
    });
  };

  const displayPageViews = (response) => {
    console.log('page views response: ', response);

    const queryResult = response.result.reports[0].data.rows;

    console.log('query result: ', queryResult);

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

    setPageViewReportData({
      ...pageViewReportData,
      labels,
      values,
    });
  };

  const displayGeo = (response) => {
    console.log('geo response: ', response);

    const queryResult = response.result.reports[0].data.rows;

    console.log('geo query result: ', queryResult);

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

  const displayCustomFrequency = (response) => {
    console.log('custom dimension frequency response: ', response);

    const queryResult = response.result.reports[0].data.rows;

    console.log('custom dimension frequency query result: ', queryResult);

    let labels = [];
    let values = [];

    queryResult.forEach((row) => {
      let label = row.dimensions.join(' - ');
      let value = row.metrics[0].values[0];

      labels.push(label);
      values.push(value);
    });

    setFrequencyData({
      ...frequencyData,
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
      .then((resp) => displayResults(resp))
      .catch((error) => console.error(error));

    getMetricsData(viewID, startDate, endDate, [timeMetric], dimensions)
      .then((resp) => displayTimeResults(resp))
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
      .then((resp) => displayPageViews(resp))
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
      [sessionsMetric],
      customDimensionFrequency
    )
      .then((resp) => displayCustomFrequency(resp))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container">
      <section className="section">
        <h2 className="subtitle">Sessions per day</h2>

        <ul>
          <li>Average: {average} sessions</li>

          {reportData.labels.map((label, i) => (
            <li>
              {label}: {reportData.values[i]} sessions
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="subtitle">Average session duration</h2>

        <ul>
          <li>Overall: {timeAverage} seconds</li>

          {timeReportData.labels.map((label, i) => (
            <li>
              {label}: {timeReportData.values[i]} seconds
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="subtitle">Page views</h2>

        <ul>
          {pageViewReportData.labels.map((label, i) => (
            <li>
              {label}: {pageViewReportData.values[i]}{' '}
              {pageViewReportData.values[i] === '1' ? 'view' : 'views'}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="subtitle">Sessions by geographic region</h2>

        <ul>
          {geoReportData.labels.map((label, i) => (
            <li>
              {label}: {geoReportData.values[i]}{' '}
              {pageViewReportData.values[i] === '1' ? 'session' : 'sessions'}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Report;
