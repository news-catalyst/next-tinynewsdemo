import React, { useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const PageViews = (props) => {
  const pageviewsRef = useRef();

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

        if (queryResult) {
          queryResult.forEach((row) => {
            let label = row.dimensions[0];

            if (!/tinycms/.test(label)) {
              if (/\?/.test(label)) {
                label = label.split('?')[0];
              }
              let value = parseInt(row.metrics[0].values[0]);

              if (pv[label]) {
                pv[label] += value;
              } else {
                pv[label] = value;
              }
            }
          });
        }

        props.setPageViews(pv);

        if (window.location.hash && window.location.hash === '#pageviews') {
          if (pageviewsRef) {
            pageviewsRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer>
        <SubHeader>Page Views</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Path</th>
            <th tw="px-4">Views</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.pageViews).map((label, i) => (
            <tr key={`page-view-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {label}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {props.pageViews[label]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PageViews;
