import React, { useState, useEffect, useRef } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const CustomDimensions = (props) => {
  const subscriptionsRef = useRef();
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [data, setData] = useState(INITIAL_STATE);

  useEffect(() => {
    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      props.metrics,
      props.dimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        if (!queryResult) {
          console.error('No results found for ' + props.dimensions);
          return;
        }

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let label = row.dimensions.join(' - ');
          let value = row.metrics[0].values[0];

          labels.push(label);
          values.push(value);
        });

        setData({
          ...data,
          labels,
          values,
        });

        if (window.location.hash && window.location.hash === '#subscriptions') {
          if (subscriptionsRef) {
            subscriptionsRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <section className="section" id="subscriptions" ref={subscriptionsRef}>
      <h2 className="title is-4">
        Sessions by audience segment: {props.label}
      </h2>

      <p className="content">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>
      <table className="table is-fullwidth" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>{props.label}</th>
            <th>Sessions</th>
          </tr>
        </thead>
        <tbody>
          {data.labels.length > 0 &&
            data.labels.map((label, i) => (
              <tr>
                <td>{label}</td>
                <td>{data.values[i]}</td>
              </tr>
            ))}
          {data.labels.length === 0 && (
            <tr>
              <td colSpan="2">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default CustomDimensions;
