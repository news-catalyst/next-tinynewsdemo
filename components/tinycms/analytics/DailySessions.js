import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';
import { formatDate } from '../../../lib/utils';

const DailySessions = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [reportData, setReportData] = useState(INITIAL_STATE);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    const sessionsMetric = 'ga:sessions';
    const dimensions = ['ga:date'];

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [sessionsMetric],
      dimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;
        const total = response.result.reports[0].data.totals[0].values[0];

        setAverage(parseInt(total / response.result.reports[0].data.rowCount));

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let formattedDate = formatDate(row.dimensions[0]);
          let value = row.metrics[0].values[0];

          labels.push(formattedDate);
          values.push(value);
        });
        setReportData({
          ...reportData,
          labels,
          values,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <section className="section">
      <div className="content">
        <h2 className="subtitle">Sessions per day</h2>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {reportData.labels.map((label, i) => (
              <tr key={`daily-sessions-row-${i}`}>
                <td>{label}</td>
                <td>{reportData.values[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DailySessions;
