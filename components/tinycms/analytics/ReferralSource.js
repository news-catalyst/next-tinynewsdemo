import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const ReferralSource = (props) => {
  const referralRef = useRef();

  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [referralData, setReferralData] = useState(INITIAL_STATE);

  useEffect(() => {
    const referralDimension = ['ga:source'];
    const sessionsMetric = 'ga:sessions';

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [sessionsMetric],
      referralDimension
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let label = row.dimensions[0];
          if (label === '/') {
            label += ' (homepage)';
          }
          let value = row.metrics[0].values[0];

          labels.push(label);
          values.push(value);
        });

        setReferralData({
          ...referralData,
          labels,
          values,
        });

        if (window.location.hash && window.location.hash === '#referral') {
          if (referralRef) {
            referralRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer ref={referralRef}>
        <SubHeader>Session by referral source</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Subscriber</th>
            <th tw="px-4">Sessions</th>
          </tr>
        </thead>
        <tbody>
          {referralData.labels.map((label, i) => (
            <tr key={`referral-data-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {label}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {referralData.values[i]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ReferralSource;
