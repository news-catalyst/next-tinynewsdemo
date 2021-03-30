import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const DonateClicks = (props) => {
  const [pageViews, setPageViews] = useState({});
  const [donateTableRows, setDonateTableRows] = useState([]);
  const [donationsFrequencyData, setDonationsFrequencyData] = useState([]);

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

            if (label === '/') {
              label += ' (homepage)';
            }
            let value = row.metrics[0].values[0];

            labels.push(label);
            values.push(value);
            pv[label] = value;
          });
        }

        setPageViews(pv);
      })
      .catch((error) => console.error(error));

    let eventMetrics = ['ga:totalEvents'];
    let eventDimensions = [
      'ga:eventCategory',
      'ga:eventAction',
      'ga:eventLabel',
      'ga:pagePath',
    ];
    let donationReadingFrequencyDim = [
      'ga:eventCategory',
      'ga:eventAction',
      'ga:eventLabel',
      'ga:dimension2',
    ];

    let donateRows = [];
    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      eventMetrics,
      eventDimensions,
      {
        filters: 'ga:eventCategory==Donate',
      }
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        let collectedData = {};
        queryResult.forEach((row) => {
          let category = row.dimensions[0];
          let action = row.dimensions[1];
          let label = row.dimensions[2];
          let articlePath = row.dimensions[3];

          let conversion = 0;
          let pvCount = 0;
          let count = parseInt(row.metrics[0].values[0]);
          if (
            pageViews &&
            pageViews[articlePath] &&
            pageViews[articlePath] > 0
          ) {
            pvCount = pageViews[articlePath];
            conversion = Math.round((count / pvCount) * 100);
          }
          if (collectedData[articlePath]) {
            if (collectedData[articlePath]['count']) {
              collectedData[articlePath]['count'] += count;
            } else {
              collectedData[articlePath]['count'] = count;
            }
            collectedData[articlePath]['conversion'] = conversion;
            collectedData[articlePath]['pageViews'] = pvCount;
          } else {
            collectedData[articlePath] = {};
            collectedData[articlePath]['count'] = count;
            collectedData[articlePath]['conversion'] = conversion;
            collectedData[articlePath]['pageViews'] = pvCount;
          }
        });

        var sortable = [];
        Object.keys(collectedData).forEach((key) => {
          sortable.push([key, collectedData[key]['conversion']]);
        });

        sortable.sort(function (a, b) {
          return b[1] - a[1];
        });

        sortable.map((item, i) => {
          let key = item[0];
          donateRows.push(
            <tr key={`donate-row-${i}`}>
              <td>{key}</td>
              <td>{collectedData[key]['count']}</td>
              <td>{collectedData[key]['pageViews']}</td>
              <td>{collectedData[key]['conversion']}</td>
            </tr>
          );
        });
        setDonateTableRows(donateRows);
      })
      .catch((error) => console.error(error));

    // get metrics for reading frequency + donation
    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      eventMetrics,
      donationReadingFrequencyDim,
      {
        filters: 'ga:eventCategory==Donate',
      }
    ).then((response) => {
      const queryResult = response.result.reports[0].data.rows;

      let donationsByFrequency = {};
      queryResult.forEach((row) => {
        let category = row.dimensions[0];
        let action = row.dimensions[1];
        let label = row.dimensions[2];
        let frequency = row.dimensions[3];
        let count = parseInt(row.metrics[0].values[0]);

        if (donationsByFrequency[frequency]) {
          donationsByFrequency[frequency] += count;
        } else {
          donationsByFrequency[frequency] = count;
        }
      });

      let donationsFrequencyRows = [];
      Object.keys(donationsByFrequency).map((key, i) => {
        donationsFrequencyRows.push(
          <tr key={`donate-row-${i}`}>
            <td>{key}</td>
            <td>{donationsByFrequency[key]}</td>
          </tr>
        );
      });
      setDonationsFrequencyData(donationsFrequencyRows);
    });
  }, [props.startDate, props.endDate]);

  return (
    <section className="section">
      <div className="content">
        <p className="subtitle is-5">Donate Button Clicks</p>

        <p className="content">
          {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
          {props.endDate.format('dddd, MMMM Do YYYY')}
        </p>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Article</th>
              <th>Clicks</th>
              <th>Article Page Views</th>
              <th>Conversion</th>
            </tr>
          </thead>
          <tbody>{donateTableRows}</tbody>
        </table>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Reading Frequency</th>
              <th>Clicks</th>
            </tr>
          </thead>
          <tbody>{donationsFrequencyData}</tbody>
        </table>
      </div>
    </section>
  );
};

export default DonateClicks;
