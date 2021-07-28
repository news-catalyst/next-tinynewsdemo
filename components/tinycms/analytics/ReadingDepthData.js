import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { hasuraGetReadingDepth } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const ReadingDepthData = (props) => {
  const depthRef = useRef();
  const [totalReadingDepth, setTotalReadingDepth] = useState({});

  useEffect(() => {
    let rdParams = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };
    const fetchReadingDepthData = async () => {
      const { errors, data } = await hasuraGetReadingDepth(rdParams);

      if (errors && !data) {
        console.error(errors);
        return errors;
      }
      let totalRD = {};
      data.ga_reading_depth.map((rd) => {
        if (!totalRD[rd.path]) {
          totalRD[rd.path] = {
            read_25: 0,
            read_50: 0,
            read_75: 0,
            read_100: 0,
            pageviews: 0,
            conversion: 0,
          };
        }
        totalRD[rd.path]['read_25'] += parseInt(rd.read_25);
        totalRD[rd.path]['read_50'] += parseInt(rd.read_50);
        totalRD[rd.path]['read_75'] += parseInt(rd.read_75);
        totalRD[rd.path]['read_100'] += parseInt(rd.read_100);
      });

      data.ga_page_views.map((pv) => {
        if (totalRD[pv.path]) {
          if (totalRD[pv.path]['pageviews']) {
            totalRD[pv.path]['pageviews'] += parseInt(pv.count);
          } else {
            totalRD[pv.path]['pageviews'] = parseInt(pv.count);
          }
        }
      });
      Object.keys(totalRD).map((path) => {
        if (totalRD[path]['pageviews'] > 0) {
          let conversion =
            (totalRD[path]['read_100'] / totalRD[path]['pageviews']) * 100;
          totalRD[path]['conversion'] = conversion;
        }
      });
      setTotalReadingDepth(totalRD);
    };
    fetchReadingDepthData();

    if (window.location.hash && window.location.hash === '#depth') {
      if (depthRef) {
        depthRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiToken, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={depthRef}>
        <SubHeader>Reading Depth</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th></th>
            <th colSpan="4">Percentage Read</th>
          </tr>
          <tr>
            <th tw="px-4">Article</th>
            <th tw="px-4">25%</th>
            <th tw="px-4">50%</th>
            <th tw="px-4">75%</th>
            <th tw="px-4">100%</th>
            <th tw="px-4">Page Views</th>
            <th tw="px-4">Read Entire Article</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(totalReadingDepth).map((path, i) => (
            <tr key={`reading-depth-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {path}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalReadingDepth[path]['read_25']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalReadingDepth[path]['read_50']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalReadingDepth[path]['read_75']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalReadingDepth[path]['read_100']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalReadingDepth[path]['pageviews']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalReadingDepth[path]['conversion'].toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ReadingDepthData;
