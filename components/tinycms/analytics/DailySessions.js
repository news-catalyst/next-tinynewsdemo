import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const DailySessions = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [reportData, setReportData] = useState(INITIAL_STATE);

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

        props.setTimeAverage(
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
  );
};

export default DailySessions;
