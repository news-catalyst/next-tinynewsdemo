import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const ReferralSource = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [referralData, setReferralData] = useState(INITIAL_STATE);

  useEffect(() => {
    const referralDimension = ['ga:source'];
    const sessionsMetric = 'ga:sessions';

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [sessionsMetric],
      referralDimension
    )
      .then((response) => {
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

        setReferralData({
          ...referralData,
          labels,
          values,
        });
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <section className="section" id="referral">
      <div className="content">
        <h2 className="subtitle">Sessions by referral source</h2>

        <p className="content">
          {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
          {props.endDate.format('dddd, MMMM Do YYYY')}
        </p>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {referralData.labels.map((label, i) => (
              <tr key={`referral-data-row-${i}`}>
                <td>{label}</td>
                <td>{referralData.values[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ReferralSource;
