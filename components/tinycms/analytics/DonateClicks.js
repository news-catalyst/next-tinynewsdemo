import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const DonateClicks = (props) => {
  const [donateTableRows, setDonateTableRows] = useState([]);

  useEffect(() => {
    let eventMetrics = ['ga:totalEvents'];
    let eventDimensions = [
      'ga:eventCategory',
      'ga:eventAction',
      'ga:eventLabel',
      'ga:pagePath',
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
        console.log('GA result: ', queryResult);

        let collectedData = {};
        queryResult.forEach((row) => {
          let category = row.dimensions[0];
          let action = row.dimensions[1];
          let label = row.dimensions[2];
          let articlePath = row.dimensions[3];

          if (articlePath !== '/') {
            let count = row.metrics[0].values[0];
            console.log(
              articlePath,
              'cat:',
              category,
              'act:',
              action,
              'lab:',
              label,
              count
            );
            if (collectedData[articlePath]) {
              collectedData[articlePath][label] = count;
            } else {
              collectedData[articlePath] = {};
              collectedData[articlePath][label] = count;
            }
          }
        });

        Object.keys(collectedData).map((key, i) => {
          donateRows.push(
            <tr key={`donate-row-${i}`}>
              <td>{key}</td>
              {Object.keys(collectedData[key]).map((subKey, i) => (
                <>
                  <td>{subKey}</td>
                  <td>{collectedData[key][subKey]}</td>
                </>
              ))}
            </tr>
          );
        });
        setDonateTableRows(donateRows);
      })
      .catch((error) => console.error(error));
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
              <th>Label</th>
              <th>Clicks</th>
            </tr>
          </thead>
          <tbody>{donateTableRows}</tbody>
        </table>
      </div>
    </section>
  );
};

export default DonateClicks;
