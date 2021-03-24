import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const NewsletterSignupFormData = (props) => {
  const [signupEventsData, setSignupEventsData] = useState({});
  const [sortedNewsletter, setSortedNewsletter] = useState([]);
  const [sortedNewsletterRows, setSortedNewsletterRows] = useState([]);

  let eventMetrics = ['ga:totalEvents'];
  let eventDimensions = [
    'ga:eventCategory',
    'ga:eventAction',
    'ga:eventLabel',
    'ga:pagePath',
    'ga:dimension2',
  ];
  getMetricsData(
    props.viewID,
    props.startDate,
    props.endDate,
    eventMetrics,
    eventDimensions,
    {
      filters: 'ga:eventCategory==NTG Newsletter',
    }
  )
    .then((resp) => {
      const queryResult = resp.result.reports[0].data.rows;

      let collectedData = {};
      queryResult.forEach((row) => {
        console.log('row:', row);

        let articlePath = row.dimensions[3];
        let eventAction = row.dimensions[1];
        let value = row.metrics[0].values[0];

        if (collectedData[articlePath]) {
          collectedData[articlePath][eventAction] = value;
        } else {
          collectedData[articlePath] = {};
          collectedData[articlePath][eventAction] = value;
        }
      });

      var sortable = [];
      Object.keys(collectedData).forEach((key) => {
        let views = collectedData[key]['Newsletter Modal Impression 1'];
        let signups = collectedData[key]['Newsletter Signup'];
        let conversion = 0;

        if (views && signups) {
          conversion = (signups / views) * 100;
        }
        collectedData[key]['conversion'] = Math.round(conversion);
        sortable.push([key, conversion]);
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      let sortedRows = [];
      setSortedNewsletter(sortable);
      sortedNewsletter.map((item) => {
        sortedRows.push(
          <tr>
            <td>{item[0]}</td>
            <td>
              {signupEventsData[item[0]]['Newsletter Modal Impression 1']}
            </td>
            <td>{signupEventsData[item[0]]['Newsletter Signup']}</td>
            <td>{signupEventsData[item[0]]['conversion']}%</td>
          </tr>
        );
      });
      setSortedNewsletterRows(sortedRows);
      setData(collectedData);
    })
    .catch((error) => console.error(error));

  return (
    <section className="section">
      <h2 className="subtitle">Website Signup Form</h2>

      <table className="table is-fullwidth" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Location</th>
            <th>Views</th>
            <th>Signups</th>
            <th>Conversion Rate</th>
          </tr>
        </thead>
        <tbody>{sortedNewsletterRows}</tbody>
      </table>
    </section>
  );
};
export default NewsletterSignupFormData;
