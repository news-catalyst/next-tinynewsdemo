import React, { useState, useEffect, useRef } from 'react';
import { getMetricsData } from '../../../lib/analytics';
import { formatDate } from '../../../lib/utils';

const AverageSessionDuration = (props) => {
  const timeRef = useRef();
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
        const rowCount = response.result.reports[0].data.rowCount;

        let total = 0;

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let formattedDate = formatDate(row.dimensions[0]);
          let value = row.metrics[0].values[0];
          total += parseInt(value);

          labels.push(formattedDate);
          values.push(value);
        });

        setTimeAverage(parseInt(total / rowCount));

        setTimeReportData({
          ...timeReportData,
          labels,
          values,
        });

        if (window.location.hash && window.location.hash === '#time') {
          if (timeRef) {
            timeRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <section className="section" id="time" ref={timeRef}>
      <div className="content">
        <h2 className="subtitle">Average session duration</h2>

        <p>Overall average: {timeAverage} seconds</p>
        <p className="content">
          {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
          {props.endDate.format('dddd, MMMM Do YYYY')}
        </p>

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
                <td> {Math.round(timeReportData.values[i])} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AverageSessionDuration;
