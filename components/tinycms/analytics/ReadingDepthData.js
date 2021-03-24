import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const ReadingDepthData = (props) => {
  const [readingDepthData, setReadingDepthData] = useState({});
  const [readingDepthTableRows, setReadingDepthTableRows] = useState([]);

  useEffect(() => {
    let eventMetrics = ['ga:totalEvents'];
    let eventDimensions = [
      'ga:eventCategory',
      'ga:eventAction',
      'ga:eventLabel',
      'ga:pagePath',
    ];

    let readingDepthRows = [];
    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      eventMetrics,
      eventDimensions,
      {
        filters: 'ga:eventCategory==NTG Article Milestone',
      }
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;
        // console.log('reading depth: ', queryResult);

        let collectedData = {};
        queryResult.forEach((row) => {
          let articlePath = row.dimensions[3];

          if (articlePath !== '/') {
            let percentage = row.dimensions[1];
            let count = row.metrics[0].values[0];
            if (collectedData[articlePath]) {
              collectedData[articlePath][percentage] = count;
            } else {
              collectedData[articlePath] = {};
              collectedData[articlePath][percentage] = count;
            }
          }
        });

        var sortable = [];
        Object.keys(collectedData).forEach((path) => {
          let read25 = 0;
          let readFullArticleCount = 0;
          Object.keys(collectedData[path]).forEach((pct) => {
            if (pct === '25%') {
              read25 = collectedData[path][pct];
            }
            if (pct === '100%') {
              readFullArticleCount = collectedData[path][pct];
            }
          });
          let readFullArticlePct = 0;
          if (read25 > 0) {
            readFullArticlePct = (readFullArticleCount / read25) * 100;
          }
          collectedData[path]['readFull'] = Math.round(readFullArticlePct);
          sortable.push([path, readFullArticlePct]);
        });

        sortable.sort(function (a, b) {
          return b[1] - a[1];
        });

        sortable.map((item, i) => {
          if (item && item[0] && collectedData[item[0]]) {
            readingDepthRows.push(
              <tr key={`reading-depth-row-${i}`}>
                <td>{item[0]}</td>
                <td>{collectedData[item[0]]['25%']}</td>
                <td>{collectedData[item[0]]['50%']}</td>
                <td>{collectedData[item[0]]['75%']}</td>
                <td>{collectedData[item[0]]['100%']}</td>
                <td>{collectedData[item[0]]['readFull']}%</td>
              </tr>
            );
          } else {
            console.log('readingDepthRows:', readingDepthRows);
            console.log('sortable:', sortable);
            console.log('collectedData:', collectedData);
          }
        });
        setReadingDepthTableRows(readingDepthRows);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <section className="section">
      <div className="content">
        <p className="subtitle is-5">Reading Depth</p>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th></th>
              <th colSpan="4">Percentage Read</th>
            </tr>
            <tr>
              <th>Article</th>
              <th>25%</th>
              <th>50%</th>
              <th>75%</th>
              <th>100%</th>
              <th>Read Full</th>
            </tr>
          </thead>
          <tbody>{readingDepthTableRows}</tbody>
        </table>
      </div>
    </section>
  );
};

export default ReadingDepthData;
