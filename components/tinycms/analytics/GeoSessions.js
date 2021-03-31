import React, { useState, useEffect, useRef } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const GeoSessions = (props) => {
  const geoRef = useRef();

  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [geoReportData, setGeoReportData] = useState(INITIAL_STATE);

  useEffect(() => {
    const pageViewsMetric = 'ga:pageviews';
    const sessionsMetric = 'ga:sessions';
    const geoDimensions = ['ga:country', 'ga:region'];

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [sessionsMetric, pageViewsMetric],
      geoDimensions
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

        setGeoReportData({
          ...geoReportData,
          labels,
          values,
        });
        if (window.location.hash && window.location.hash === '#geo') {
          if (geoRef) {
            geoRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <section className="section" id="geo" ref={geoRef}>
      <div className="content">
        <h2 className="subtitle">Sessions by geographic region</h2>

        <p className="content">
          {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
          {props.endDate.format('dddd, MMMM Do YYYY')}
        </p>
        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Country - Region</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {geoReportData.labels.map((label, i) => (
              <tr key={`geo-report-row-${i}`}>
                <td>{label}</td>
                <td> {geoReportData.values[i]} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default GeoSessions;
