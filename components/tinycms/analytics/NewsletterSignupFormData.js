import React, { useState, useEffect, useRef } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const NewsletterSignupFormData = (props) => {
  const signupRef = useRef();

  const [sortedNewsletterRows, setSortedNewsletterRows] = useState([]);
  const [frequencySignups, setFrequencySignups] = useState([]);

  useEffect(() => {
    let eventMetrics = ['ga:totalEvents'];
    let eventDimensions = [
      'ga:eventCategory',
      'ga:eventAction',
      'ga:eventLabel',
      'ga:pagePath',
    ];
    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      eventMetrics,
      ['ga:eventCategory', 'ga:eventAction', 'ga:eventLabel', 'ga:dimension2'],
      {
        filters:
          'ga:eventCategory==NTG Newsletter;ga:eventAction==Newsletter Signup',
      }
    ).then((resp) => {
      const queryResult = resp.result.reports[0].data.rows;
      console.log('dimension2 results:', queryResult);
      let collectedData = {};
      queryResult.forEach((row) => {
        let frequency = row.dimensions[3];
        let signupCount = row.metrics[0].values[0];
        collectedData[frequency] = signupCount;
      });
      var sortable = [];
      Object.keys(collectedData).forEach((key) => {
        let signups = collectedData[key];
        sortable.push([key, signups]);
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      setFrequencySignups(sortable);
    });

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
        sortable.map((item, i) => {
          // console.log("item:", item)
          if (item && item[0]) {
            // console.log("item:", item, collectedData[item[0]])
            sortedRows.push(
              <tr key={`newsletter-signup-row-${i}`}>
                <td>{item[0]}</td>
                <td>
                  {collectedData[item[0]]['Newsletter Modal Impression 1']}
                </td>
                <td>{collectedData[item[0]]['Newsletter Signup']}</td>
                <td>{collectedData[item[0]]['conversion']}%</td>
              </tr>
            );
          } else {
            console.error('NEWSLETTER MISSING ITEM', sortedNewsletter);
          }
        });
        setSortedNewsletterRows(sortedRows);
        if (window.location.hash && window.location.hash === '#signups') {
          if (signupRef) {
            signupRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <section className="section" id="signups" ref={signupRef}>
        <h2 className="subtitle">Website Signup Form</h2>

        <p className="content">
          {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
          {props.endDate.format('dddd, MMMM Do YYYY')}
        </p>

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

      <section className="section">
        <h2 className="subtitle">Signups by Reading Frequency</h2>

        <p className="content">
          {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
          {props.endDate.format('dddd, MMMM Do YYYY')}
        </p>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Articles Read</th>
              <th>Signups</th>
            </tr>
          </thead>
          <tbody>
            {frequencySignups.map((item, i) => (
              <tr key={`frequency-signup-row-${i}`}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};
export default NewsletterSignupFormData;
