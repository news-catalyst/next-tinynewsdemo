import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const ReadingDepthData = (props) => {
  const depthRef = useRef();
  const [readingDepthTableRows, setReadingDepthTableRows] = useState([]);

  useEffect(() => {
    let eventMetrics = ['ga:totalEvents'];
    let eventDimensions = [
      'ga:eventCategory',
      'ga:eventAction',
      'ga:eventLabel',
      'ga:pagePath',
    ];

    let readingDepthRows = [];
    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      eventMetrics,
      eventDimensions,
      {
        filters: 'ga:eventCategory==NTG Article Milestone',
      }
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;
        // console.log('reading depth: ', queryResult);

        let collectedData = {};
        queryResult.forEach((row) => {
          let articlePath = row.dimensions[3];

          if (articlePath !== '/') {
            let percentage = row.dimensions[1];
            let count = row.metrics[0].values[0];
            if (collectedData[articlePath]) {
              collectedData[articlePath][percentage] = count;
            } else {
              collectedData[articlePath] = {};
              collectedData[articlePath][percentage] = count;
            }
          }
        });

        var sortable = [];
        Object.keys(collectedData).forEach((path) => {
          let read25 = 0;
          let readFullArticleCount = 0;
          Object.keys(collectedData[path]).forEach((pct) => {
            if (pct === '25%') {
              read25 = collectedData[path][pct];
            }
            if (pct === '100%') {
              readFullArticleCount = collectedData[path][pct];
            }
          });

          let conversion = 0;
          let pageViews = 0;
          if (
            props.pageViews &&
            props.pageViews[path] &&
            props.pageViews[path] > 0
          ) {
            conversion = (readFullArticleCount / props.pageViews[path]) * 100;
            pageViews = props.pageViews[path];
          }
          collectedData[path]['pageViews'] = pageViews;
          collectedData[path]['conversion'] = Math.round(conversion);
          sortable.push([path, conversion]);
        });

        sortable.sort(function (a, b) {
          return b[1] - a[1];
        });

        sortable.map((item, i) => {
          if (item && item[0] && collectedData[item[0]]) {
            readingDepthRows.push(
              <tr key={`reading-depth-row-${i}`}>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {item[0]}
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {collectedData[item[0]]['25%']}
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {collectedData[item[0]]['50%']}
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {collectedData[item[0]]['75%']}
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {collectedData[item[0]]['100%']}
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {collectedData[item[0]]['pageViews']}
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {collectedData[item[0]]['conversion']}%
                </td>
              </tr>
            );
          }
        });
        setReadingDepthTableRows(readingDepthRows);

        if (window.location.hash && window.location.hash === '#depth') {
          if (depthRef) {
            depthRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.pageViews, props.startDate, props.endDate]);

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
        <tbody>{readingDepthTableRows}</tbody>
      </table>
    </>
  );
};

export default ReadingDepthData;
