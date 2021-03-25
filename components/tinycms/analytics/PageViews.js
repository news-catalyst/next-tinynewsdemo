import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const PageViews = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [pageViewReportData, setPageViewReportData] = useState(INITIAL_STATE);

  let pv = {};

  useEffect(() => {
    const pageViewsMetric = 'ga:pageviews';
    const pvDimensions = ['ga:pagePath'];
    const orderBy = { fieldName: pageViewsMetric, order: 'DESCENDING' };

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [pageViewsMetric],
      pvDimensions,
      orderBy
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let label = row.dimensions[0];

          if (!/tinycms/.test(label)) {
            console.log('skip tinycms');

            if (label === '/') {
              label += ' (homepage)';
            }
            let value = row.metrics[0].values[0];

            labels.push(label);
            values.push(value);
            pv[label] = value;
          }
        });

        setPageViewReportData({
          ...pageViewReportData,
          labels,
          values,
        });
        props.setPageViews(pv);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <section className="section">
      <h2 className="subtitle">Page views</h2>

      <table className="table is-fullwidth" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Path</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {pageViewReportData.labels.map((label, i) => (
            <tr key={`page-view-row-${i}`}>
              <td>{label}</td>
              <td>{pageViewReportData.values[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PageViews;
