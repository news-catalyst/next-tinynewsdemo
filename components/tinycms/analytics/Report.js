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
  const [startDate, setStartDate] = useState(addDays(new Date(), -30));
  const [endDate, setEndDate] = useState(new Date());
  const [average, setAverage] = useState(0);

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
  useEffect(() => {
    const metrics = 'ga:sessions';
    const dimensions = ['ga:date'];
    getMetricsData(viewID, startDate, endDate, metrics, dimensions)
      .then((resp) => displayResults(resp))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <h1 className="title">Sessions per day</h1>

      <ul>
        <li>Average: {average} sessions</li>

        {reportData.labels.map((label, i) => (
          <li>
            {label}: {reportData.values[i]} sessions
          </li>
        ))}
      </ul>
    </>
  );
};

export default Report;
