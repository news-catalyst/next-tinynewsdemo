import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';
import { formatDate } from '../../../lib/utils';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const DailySessions = (props) => {
  const dailyRef = useRef();

  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [reportData, setReportData] = useState(INITIAL_STATE);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    const sessionsMetric = 'ga:sessions';
    const dimensions = ['ga:date'];

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [sessionsMetric],
      dimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;
        const total = response.result.reports[0].data.totals[0].values[0];

        setAverage(parseInt(total / response.result.reports[0].data.rowCount));

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let formattedDate = formatDate(row.dimensions[0]);
          let value = row.metrics[0].values[0];

          labels.push(formattedDate);
          values.push(value);
        });
        setReportData({
          ...reportData,
          labels,
          values,
        });

        if (window.location.hash && window.location.hash === '#daily') {
          if (dailyRef) {
            dailyRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer ref={dailyRef}>
        <SubHeader>Sessions per day</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Date</th>
            <th tw="px-4">Sessions</th>
          </tr>
        </thead>
        <tbody>
          {reportData.labels.map((label, i) => (
            <tr key={`daily-sessions-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {label}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {reportData.values[i]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default DailySessions;
