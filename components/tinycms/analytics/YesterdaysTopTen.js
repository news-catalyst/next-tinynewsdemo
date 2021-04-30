import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import { parsePageViews } from '../../../lib/utils';
import { getMetricsData } from '../../../lib/analytics';
import moment from 'moment';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const YesterdaysTopTen = (props) => {
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [pageViews, setPageViews] = useState({});

  let pv = {};

  useEffect(() => {
    const pageViewsMetric = 'ga:pageviews';
    const pvDimensions = ['ga:pagePath'];

    getMetricsData(
      props.viewID,
      startDate,
      endDate,
      [pageViewsMetric],
      pvDimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        pv = parsePageViews(queryResult);
        setPageViews(pv);
      })
      .catch((error) => console.error(error));
  }, [startDate, endDate]);

  return (
    <>
      <SubHeaderContainer>
        <SubHeader>Top 10 Stories Overall</SubHeader>
      </SubHeaderContainer>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Path</th>
            <th tw="px-4">Views</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(pageViews).map((label, i) => (
            <tr key={`page-view-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {label}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {pageViews[label]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default YesterdaysTopTen;
