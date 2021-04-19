import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const ReadingFrequencyData = (props) => {
  const frequencyRef = useRef();
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [frequencyData, setFrequencyData] = useState(INITIAL_STATE);
  const [readingFrequencyTableRows, setReadingFrequencyTableRows] = useState(
    []
  );

  useEffect(() => {
    const pageViewsMetric = 'ga:pageviews';
    let readingFrequencyRows = [];

    const customDimensionFrequency = ['ga:dimension2'];
    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [pageViewsMetric],
      customDimensionFrequency
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        let labels = [];
        let values = [];

        var sortable = [];
        queryResult.forEach((row) => {
          let label = row.dimensions.join(' - ');
          let value = row.metrics[0].values[0];

          labels.push(label);
          values.push(value);
          sortable.push([value, label]);
        });
        setFrequencyData({ ...frequencyData, labels, values });

        sortable.sort(function (a, b) {
          return b[0] - a[0];
        });

        sortable.map((item, i) => {
          readingFrequencyRows.push(
            <tr key={`reading-frequency-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {item[1]}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {item[0]}
              </td>
            </tr>
          );
        });
        setReadingFrequencyTableRows(readingFrequencyRows);

        if (window.location.hash && window.location.hash === '#frequency') {
          if (frequencyRef) {
            frequencyRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer ref={frequencyRef}>
        <SubHeader>Page views by audience segment: reading frequency</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Number of Articles</th>
            <th tw="px-4">Views</th>
          </tr>
        </thead>
        <tbody>{readingFrequencyTableRows}</tbody>
      </table>
    </>
  );
};

export default ReadingFrequencyData;
