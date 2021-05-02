import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import { parsePageViews, parseReadingDepth } from '../../../lib/utils';
import { getMetricsData } from '../../../lib/analytics';
import moment from 'moment';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const YesterdaysTopTen = (props) => {
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [pageViews, setPageViews] = useState({});
  const [readingDepthStats, setReadingDepthStats] = useState({});

  let pv = {};

  useEffect(() => {
    const pageViewsMetric = 'ga:pageviews';
    const pvDimensions = ['ga:pagePath'];

    const eventMetrics = ['ga:totalEvents'];
    const eventDimensions = [
      'ga:eventCategory',
      'ga:eventAction',
      'ga:eventLabel',
      'ga:pagePath',
    ];

    getMetricsData(
      props.viewID,
      startDate,
      endDate,
      [pageViewsMetric],
      pvDimensions,
      {
        filters: 'ga:pagePath=@articles',
      }
    )
      .then((response) => {
        const topStories = response.result.reports[0].data.rows;
        pv = parsePageViews(topStories, 10);
        setPageViews(pv);

        getMetricsData(
          props.viewID,
          startDate,
          endDate,
          eventMetrics,
          eventDimensions,
          {
            filters:
              'ga:eventCategory==NTG Article Milestone;ga:pagePath=@articles',
          }
        ).then((eventsResponse) => {
          const readingDepth = eventsResponse.result.reports[0].data.rows;
          let collectedData = parseReadingDepth(readingDepth);
          Object.keys(collectedData).forEach((path) => {
            if (pv[path] > 0) {
              collectedData[path]['readFull'] = Math.round(
                (collectedData[path]['100%'] / pv[path]) * 100
              );
            }
          });
          setReadingDepthStats(collectedData);
        });
      })
      .catch((error) => console.error(error));
  }, [startDate, endDate]);

  return (
    <>
      <SubHeaderContainer>
        <SubHeader>Top 10 Stories Overall</SubHeader>
      </SubHeaderContainer>

      {Object.keys(pageViews).length <= 0 && (
        <p tw="px-4">Not enough data for the past 24 hours.</p>
      )}

      {Object.keys(pageViews).length > 0 && (
        <table tw="w-full table-auto">
          <thead>
            <tr>
              <th tw="px-4">Path</th>
              <th tw="px-4">Views</th>
              <th tw="px-4">Read 100%</th>
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
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {readingDepthStats[label] &&
                    `${readingDepthStats[label]['readFull']}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default YesterdaysTopTen;
