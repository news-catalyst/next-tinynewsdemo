import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const GeoSessions = (props) => {
  const geoRef = useRef();

  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [geoReportData, setGeoReportData] = useState(INITIAL_STATE);

  useEffect(() => {
    const pageViewsMetric = 'ga:pageviews';
    const sessionsMetric = 'ga:sessions';
    const geoDimensions = ['ga:country', 'ga:region'];

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [sessionsMetric, pageViewsMetric],
      geoDimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let label = row.dimensions.join(' - ');
          let value = row.metrics[0].values[0];

          labels.push(label);
          values.push(value);
        });

        setGeoReportData({
          ...geoReportData,
          labels,
          values,
        });
        if (window.location.hash && window.location.hash === '#geo') {
          if (geoRef) {
            geoRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer ref={geoRef}>
        <SubHeader>Sessions by geographic region</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Country - Region</th>
            <th tw="px-4">Sessions</th>
          </tr>
        </thead>
        <tbody>
          {geoReportData.labels.map((label, i) => (
            <tr key={`geo-report-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {label}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {' '}
                {geoReportData.values[i]}{' '}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GeoSessions;
