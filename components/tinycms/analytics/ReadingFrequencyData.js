import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const ReadingFrequencyData = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [frequencyData, setFrequencyData] = useState(INITIAL_STATE);

  useEffect(() => {
    const pageViewsMetric = 'ga:pageviews';

    const customDimensionFrequency = ['ga:dimension2'];
    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [pageViewsMetric],
      customDimensionFrequency
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let label = row.dimensions.join(' - ');
          let value = row.metrics[0].values[0];

          labels.push(label);
          values.push(value);
        });
        setFrequencyData({ ...frequencyData, labels, values });
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <section className="section">
      <h2 className="subtitle">
        Page views by audience segment: reading frequency
      </h2>

      <p className="content">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table className="table is-fullwidth" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Number of Articles</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {frequencyData.labels.map((label, i) => (
            <tr key={i}>
              <td>{label}</td>
              <td>{frequencyData.values[i]} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ReadingFrequencyData;
