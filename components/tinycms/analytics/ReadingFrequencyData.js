import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { hasuraGetReadingFrequency } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const ReadingFrequencyData = (props) => {
  const frequencyRef = useRef();
  const [totalReadingFrequency, setTotalReadingFrequency] = useState({});

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };
    const fetchReadingFrequency = async () => {
      const { errors, data } = await hasuraGetReadingFrequency(params);

      if (errors && !data) {
        console.error(errors);
      }
      let totalRF = {};
      data.ga_reading_frequency.map((rf) => {
        if (totalRF[rf.category]) {
          totalRF[rf.category] += parseInt(rf.count);
        } else {
          totalRF[rf.category] = parseInt(rf.count);
        }
      });
      setTotalReadingFrequency(totalRF);
    };
    fetchReadingFrequency();
    if (window.location.hash && window.location.hash === '#frequency') {
      if (frequencyRef) {
        frequencyRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
        <tbody>
          {Object.keys(totalReadingFrequency).map((category, i) => (
            <tr key={`reading-frequency-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {category}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalReadingFrequency[category]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ReadingFrequencyData;
