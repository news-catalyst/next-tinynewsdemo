import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';
import { formatDate } from '../../../lib/utils';

const AverageSessionDuration = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [timeReportData, setTimeReportData] = useState(INITIAL_STATE);
  const [timeAverage, setTimeAverage] = useState(0);

  useEffect(() => {
    const dimensions = ['ga:date'];
    const timeMetric = 'ga:avgSessionDuration';

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [timeMetric],
      dimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;
        const total = response.result.reports[0].data.totals[0].values[0];

        setTimeAverage(
          parseInt(total / response.result.reports[0].data.rowCount)
        );

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
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <section className="section">
      <div className="content">
        <p className="subtitle is-5">Average session duration</p>

        <p>Overall average: {props.timeAverage} seconds</p>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Seconds</th>
            </tr>
          </thead>
          <tbody>
            {timeReportData.labels.map((label, i) => (
              <tr key={`time-report-${i}`}>
                <td> {label} </td>
                <td> {timeReportData.values[i]} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AverageSessionDuration;
