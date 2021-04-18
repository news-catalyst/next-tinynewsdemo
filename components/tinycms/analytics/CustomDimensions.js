import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const CustomDimensions = (props) => {
  const subscriptionsRef = useRef();
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [data, setData] = useState(INITIAL_STATE);

  useEffect(() => {
    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      props.metrics,
      props.dimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        if (!queryResult) {
          console.error('No results found for ' + props.dimensions);
          return;
        }

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let label = row.dimensions.join(' - ');
          let value = row.metrics[0].values[0];

          labels.push(label);
          values.push(value);
        });

        setData({
          ...data,
          labels,
          values,
        });

        if (window.location.hash && window.location.hash === '#subscriptions') {
          if (subscriptionsRef) {
            subscriptionsRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer ref={subscriptionsRef}>
        <SubHeader>Sessions by audience segment: {props.label}</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>
      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">{props.label}</th>
            <th tw="px-4">Sessions</th>
          </tr>
        </thead>
        <tbody>
          {data.labels.length > 0 &&
            data.labels.map((label, i) => (
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {label}
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {data.values[i]}
                </td>
              </tr>
            ))}
          {data.labels.length === 0 && (
            <tr>
              <td
                colSpan="2"
                tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default CustomDimensions;
