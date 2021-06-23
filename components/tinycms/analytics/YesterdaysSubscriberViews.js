import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import { parseDonorViews } from '../../../lib/utils';
import { getMetricsData } from '../../../lib/analytics';
import moment from 'moment';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const YesterdaysSubscriberViews = (props) => {
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [donorViews, setDonorViews] = useState({});

  useEffect(() => {
    const donorMetric = ['ga:pageviews'];
    const donorDimensions = ['ga:dimension5', 'ga:pagePath'];
    getMetricsData(
      props.viewID,
      startDate,
      endDate,
      donorMetric,
      donorDimensions,
      {
        filters: 'ga:pagePath=@articles',
      }
    )
      .then((response) => {
        if (
          response &&
          response.result &&
          response.result.reports &&
          response.result.reports[0] &&
          response.result.reports[0].data &&
          response.result.reports[0].data.rows
        ) {
          const queryResult = response.result.reports[0].data.rows;
          let donorData = parseDonorViews(queryResult);
          setDonorViews(donorData);
        }
      })
      .catch((error) => console.error(error));
  }, [startDate, endDate, props.viewID]);

  return (
    <>
      <SubHeaderContainer>
        <SubHeader>Top 10 Stories by Subscribers</SubHeader>
      </SubHeaderContainer>

      {Object.keys(donorViews).length <= 0 && (
        <p tw="px-4">Not enough data for the past 24 hours.</p>
      )}

      {Object.keys(donorViews).length > 0 && (
        <table tw="w-full table-auto">
          <thead>
            <tr>
              <th tw="px-4">Path</th>
              <th tw="px-4">Views</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(donorViews).map((label, i) => (
              <tr key={`donor-view-row-${i}`}>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {label}
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {donorViews[label]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default YesterdaysSubscriberViews;
