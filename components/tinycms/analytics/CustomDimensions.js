import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { hasuraGetCustomDimension } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const CustomDimensions = (props) => {
  const subscriptionsRef = useRef();
  const [customDims, setCustomDims] = useState([]);

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
      dimension: props.dimension,
    };
    const fetchCustomDimension = async () => {
      const { errors, data } = await hasuraGetCustomDimension(params);

      if (errors && !data) {
        console.error(errors);
      }

      console.log('data:', data);
      setCustomDims(data.ga_custom_dimensions);
    };
    fetchCustomDimension();

    if (window.location.hash && window.location.hash === '#subscriptions') {
      if (subscriptionsRef) {
        subscriptionsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
          {customDims.length > 0 &&
            customDims.map((item, i) => (
              <tr key={`label-row-${i}`}>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {item.date}
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {item.count}
                </td>
              </tr>
            ))}
          {customDims.length === 0 && (
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
