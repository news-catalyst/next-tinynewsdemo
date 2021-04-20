import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';
import { formatDate } from '../../../lib/utils';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const AverageSessionDuration = (props) => {
  const timeRef = useRef();
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [timeReportData, setTimeReportData] = useState(INITIAL_STATE);
  const [timeAverage, setTimeAverage] = useState(0);

  useEffect(() => {
    const dimensions = ['ga:date'];
    const timeMetric = 'ga:avgSessionDuration';

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [timeMetric],
      dimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;
        const rowCount = response.result.reports[0].data.rowCount;

        let total = 0;

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let formattedDate = formatDate(row.dimensions[0]);
          let value = row.metrics[0].values[0];
          total += parseInt(value);

          labels.push(formattedDate);
          values.push(value);
        });

        setTimeAverage(parseInt(total / rowCount));

        setTimeReportData({
          ...timeReportData,
          labels,
          values,
        });

        if (window.location.hash && window.location.hash === '#time') {
          if (timeRef) {
            timeRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer ref={timeRef}>
        <SubHeader>Average Session Duration</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <p>Overall average: {timeAverage} seconds</p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Date</th>
            <th tw="px-4">Seconds</th>
          </tr>
        </thead>
        <tbody>
          {timeReportData.labels.map((label, i) => (
            <tr key={`time-report-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {label}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {Math.round(timeReportData.values[i])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AverageSessionDuration;
