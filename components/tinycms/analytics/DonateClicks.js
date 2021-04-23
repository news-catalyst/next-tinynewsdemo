import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const DonateClicks = (props) => {
  const donationsRef = useRef();
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

            if (!/tinycms/.test(label)) {
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

        // setPageViews(pv);

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

            let collectedData = {};
            queryResult.forEach((row) => {
              let category = row.dimensions[0];
              let action = row.dimensions[1];
              let label = row.dimensions[2];
              let articlePath = row.dimensions[3];

              if (articlePath !== '/') {
                let conversion = 0;
                let pvCount = 0;
                let count = row.metrics[0].values[0];
                if (pv && pv[articlePath] && pv[articlePath] > 0) {
                  pvCount = pv[articlePath];
                  conversion = Math.round((count / pvCount) * 100);
                }
                if (
                  collectedData[articlePath] &&
                  collectedData[articlePath][label]
                ) {
                  collectedData[articlePath][label]['count'] = count;
                  collectedData[articlePath][label]['conversion'] = conversion;
                  collectedData[articlePath][label]['pageViews'] = pvCount;
                } else {
                  collectedData[articlePath] = {};
                  collectedData[articlePath][label] = {};
                  collectedData[articlePath][label]['count'] = count;
                  collectedData[articlePath][label]['conversion'] = conversion;
                  collectedData[articlePath][label]['pageViews'] = pvCount;
                }
              }
            });
            var sortable = [];
            Object.keys(collectedData).forEach((key) => {
              Object.keys(collectedData[key]).forEach((subKey) => {
                sortable.push([key, collectedData[key][subKey]['conversion']]);
              });
            });

            sortable.sort(function (a, b) {
              return b[1] - a[1];
            });

            sortable.map((item, i) => {
              let key = item[0];
              donateRows.push(
                <tr key={`donate-table-row-${i}`}>
                  <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                    {key}
                  </td>
                  {Object.keys(collectedData[key]).map((subKey, i) => (
                    <>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {subKey}
                      </td>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {collectedData[key][subKey]['count']}
                      </td>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {collectedData[key][subKey]['pageViews']}
                      </td>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {collectedData[key][subKey]['conversion']}%
                      </td>
                    </>
                  ))}
                </tr>
              );
            });
            setDonateTableRows(donateRows);

            if (window.location.hash && window.location.hash === '#donations') {
              if (donationsRef) {
                donationsRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));

    let eventMetrics = ['ga:totalEvents'];
    let donationReadingFrequencyDim = [
      'ga:eventCategory',
      'ga:eventAction',
      'ga:eventLabel',
      'ga:dimension2',
    ];

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
          <tr key={`donate-reading-frequency-row-${i}`}>
            <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
              {key}
            </td>
            <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
              {donationsByFrequency[key]}
            </td>
          </tr>
        );
      });
      setDonationsFrequencyData(donationsFrequencyRows);
    });
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer>
        <SubHeader>Donate Button Clicks</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Article</th>
            <th tw="px-4">Label</th>
            <th tw="px-4">Clicks</th>
            <th tw="px-4">Views</th>
            <th tw="px-4">Conversion</th>
          </tr>
        </thead>
        <tbody>{donateTableRows}</tbody>
      </table>

      <table tw="pt-10 mt-10 w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Reading Frequency</th>
            <th tw="px-4">Clicks</th>
          </tr>
        </thead>
        <tbody>{donationsFrequencyData}</tbody>
      </table>
    </>
  );
};

export default DonateClicks;
