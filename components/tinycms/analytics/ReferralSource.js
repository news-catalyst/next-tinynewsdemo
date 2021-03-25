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
  }, []);

  return (
    <section className="section">
      <div className="content">
        <h2 className="subtitle">Sessions by referral source</h2>

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
