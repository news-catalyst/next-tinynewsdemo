import React, { useState, useEffect, useRef } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const PageViews = (props) => {
  const pageviewsRef = useRef();
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

        if (queryResult) {
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
        }

        setPageViewReportData({
          ...pageViewReportData,
          labels,
          values,
        });
        props.setPageViews(pv);

        if (window.location.hash && window.location.hash === '#pageviews') {
          if (pageviewsRef) {
            pageviewsRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <section className="section" id="pageviews" ref={pageviewsRef}>
      <h2 className="title is-4">Page views</h2>
      <p className="content">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

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
